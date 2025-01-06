import { makeAutoObservable } from "mobx";

import { cards } from "../const";
import { shuffle } from "../../utils";
import { CardType, BoardCard, Card } from "./card";
import { Player, IPlayer } from "./player";
import { BallCollection, IBallCollection } from "./ballCollection";
import { BallTypes } from "./ball";

class Game {
  numPlayers?: number = undefined;
  boardBallCollection?: BallCollection = undefined;
  boardCards?: BoardCard[] = undefined;
  round?: number = undefined;
  turn?: number = undefined;
  players: IPlayer[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  init(numPlayers: number) {
    this.numPlayers = numPlayers;
    if (
      this.numPlayers === undefined ||
      this.numPlayers < 2 ||
      this.numPlayers > 4
    )
      return Error(`Number of Players is wrong (numPlayers: {this.numPlayers}`);
    this.initBoard(this.numPlayers);
    for (let i = 0; i < this.numPlayers; ++i) {
      this.initPlayer(i);
    }
    this.round = 1;
    this.turn = 0;
  }

  initPlayer(id: number) {
    this.players.push(new Player(id));
  }

  initBoard(numPlayers: number) {
    const ballNumbers = [4, 5, 7];
    this.boardBallCollection = new BallCollection({
      masterball: 5,
      ultraball: ballNumbers[numPlayers - 2],
      quickball: ballNumbers[numPlayers - 2],
      healball: ballNumbers[numPlayers - 2],
      greatball: ballNumbers[numPlayers - 2],
      pokeball: ballNumbers[numPlayers - 2],
    });

    this.boardCards = Object.values(cards).map((card) => ({
      ...card,
      open: false,
    }));

    this.shuffleBoardCards();
    this.openBoardCards();
  }

  nextTurn() {
    if (
      this.turn === undefined ||
      this.round === undefined ||
      this.numPlayers === undefined
    ) {
      console.error(
        "[Invalid Environment] You need to initialize game before starting"
      );
      return false;
    }
    this.turn = (this.turn + 1) % this.numPlayers;
    if (this.turn === 0) this.round++;
  }

  // TODO: change not to touch balls object in ball collector.
  modifyBallCollection(playerIdx: number, reqBallCollection: BallCollection) {
    const player = this.players[playerIdx];

    // [copy player ball collection]
    const nbc = player.ballCollection.deepCopy();

    // [apply minus ball]
    for (let key of BallTypes) {
      if (reqBallCollection.balls[key] >= 0) continue;
      if (nbc.balls[key] + reqBallCollection.balls[key] < 0) {
        console.error(
          "[Invalid Input] the number of requested removing ball is upper than own"
        );
        return false;
      }
      nbc.balls[key] += reqBallCollection.balls[key];
      reqBallCollection.balls[key] = 0;
    }

    // [validation of requested ball collection]
    // 1. if number of all balls > 3, raise Error
    const totBallCnt = Object.values(reqBallCollection.balls).reduce(
      (acc, cnt) => acc + cnt
    );
    if (totBallCnt > 3) {
      console.error("[Invalid Input] number of maximum total ball is 3");
      return false;
    }
    // 2. if the number of balls of one type > 2, raise Error
    const maxBallCnt = Object.values(reqBallCollection.balls).reduce(
      (acc, cnt) => (acc < cnt ? cnt : acc)
    );
    if (maxBallCnt > 2) {
      console.error("[Invalid Input] number of maximum ball for a type is 2");
      return false;
    }
    // 3. if the number of balls of one type = 2 and number of ball types (not 0) > 1, raise Error
    if (maxBallCnt === 2 && totBallCnt > 2) {
      console.error(
        "[Invalid Input] if you choose 2 balls for a type, you can't choose another ball"
      );
      return false;
    }
    // 4. if the number of ball types > 3, raise Error
    const ballTypeCnt = Object.values(reqBallCollection.balls).reduce(
      (acc, cnt) => (cnt > 0 ? acc + 1 : acc)
    );
    if (ballTypeCnt > 3) {
      console.error("[Invalid Input] number of maximum ball type is 3");
      return false;
    }
    // 5. if the selected ball is "master ball", then tot number limited to 1.
    if (reqBallCollection.balls.masterball > 0 && totBallCnt > 1) {
      console.error(
        "[Invalid Input] number of maximum total ball is 1 for master ball"
      );
      return false;
    }
    // 6. after update, if the numbe of total ball number > 10, raise Error
    const playerTotBallCnt = Object.values(nbc.balls).reduce(
      (acc, cnt) => acc + cnt
    );
    if (playerTotBallCnt + totBallCnt > 10) {
      console.error("[Invalid Input] number of maximum owned ball is 10");
      return false;
    }
    // 7. if the boardBallCollection doesn't have enough balls for the request, raise Error
    if (this.boardBallCollection === undefined) {
      console.error(
        "[Invalid Environment] BoardBallCollection isn't exist, You need to initialize game."
      );
      return false;
    }
    if (!this.boardBallCollection[">="](reqBallCollection)) {
      console.error(
        "[Invalid Input] boardBallCollection doesn't have enough balls for the request"
      );
      return false;
    }

    // [update]
    for (let key of BallTypes) {
      nbc.balls[key] += reqBallCollection.balls[key];
    }

    this.players[playerIdx].ballCollection = nbc;
    this.boardBallCollection = this.boardBallCollection["-"](reqBallCollection);
    return true;
  }

  reservePokemonCard(playerIdx: number, cardId: number) {
    const player = this.players[playerIdx];

    // [validate request]
    // 1. check whether boardCard exist
    if (this.boardCards === undefined) {
      console.error(
        "[Invalid Environment] BoardCard isn't exist, You need to initialize game."
      );
      return false;
    }
    // 2. check whether card exist in game or not
    const card = cards[cardId];
    if (card === undefined) {
      console.error(`[Invalid Input] card(${cardId}) isn't exist in game`);
      return false;
    }
    // 3. check whether card exist in board or not
    let boardCard: BoardCard | undefined = undefined;
    for (let i = 0; i < this.boardCards.length; ++i) {
      if (cardId === this.boardCards[i].id) {
        boardCard = this.boardCards[i];
        break;
      }
    }
    if (boardCard === undefined) {
      console.error(`[Invalid Input] card(${cardId}) isn't exist in board`);
      return false;
    }

    // [update]
    player.resevedCards.push(card);
    this.boardCards = this.boardCards.filter((bc) => boardCard?.id !== bc.id);
    this.openBoardCards();

    return true;
  }

  capturePokemonCard(
    playerIdx: number,
    costBallCollection: IBallCollection,
    cardId: number
  ) {
    const player = this.players[playerIdx];

    // [validate request]
    // 1. check whether boardCard exist
    if (this.boardCards === undefined) {
      console.error(
        "[Invalid Environment] BoardCard isn't exist, You need to initialize game."
      );
      return false;
    }
    // 2. check whether board ballcollection exist
    if (this.boardBallCollection === undefined) {
      console.error(
        "[Invalid Environment] BoardBallCollection isn't exist, You need to initialize game."
      );
      return false;
    }
    // 3. check whether card exist in game or not
    const card = cards[cardId];
    if (card === undefined) {
      console.error(`[Invalid Input] card(${cardId}) isn't exist in game`);
      return false;
    }
    // 4. check whether card exist in both of board or player hands, or not
    let boardCard: BoardCard | undefined = undefined;
    for (let i = 0; i < this.boardCards.length; ++i) {
      if (cardId === this.boardCards[i].id) {
        boardCard = this.boardCards[i];
        break;
      }
    }
    let reservedCard: Card | undefined = undefined;
    for (let i = 0; i < player.resevedCards.length; ++i) {
      if (cardId === player.resevedCards[i].id) {
        reservedCard = player.resevedCards[i];
        break;
      }
    }
    if (boardCard === undefined && reservedCard === undefined) {
      console.error(
        `[Invalid Input] card(${cardId}) isn't exist in board and player hands`
      );
      return false;
    }
    // 5. check whether player has costing balls sent as a param
    if (!player.ballCollection[">="](costBallCollection)) {
      console.error(
        `[Invalid Input] player(${playerIdx})'s cost balls are invalid (not enough)`
      );
      return false;
    }

    // 6. check whether player has enough balls for buying this card.
    const srcBallCollection = costBallCollection["+"](
      player.getDiscountBallCollection()
    );
    const masterballCnt = srcBallCollection.balls.masterball;
    const remainBallCnt = Object.values(
      card.neededBallsForCapturing["-"](srcBallCollection).balls
    ).reduce((acc, value) => acc + value);

    // TODO: select validation way.
    // if we use "!==", then check correction,
    // if we use "<", then check sufficiency.
    if (masterballCnt !== remainBallCnt) {
      console.error(
        `[Invalid Input] player(${playerIdx})'s ball isn't match to buy card(${cardId})`
      );
      return false;
    }

    // [update]
    player.ballCollection = player.ballCollection["-"](costBallCollection);
    this.boardBallCollection =
      this.boardBallCollection["+"](costBallCollection);
    player.capturedCards.push(card);

    this.boardCards = this.boardCards.filter((bc) => card.id !== bc.id);
    this.openBoardCards();
    player.resevedCards = player.resevedCards.filter((rc) => card.id !== rc.id);

    return true;
  }

  shuffleBoardCards() {
    if (this.boardCards === undefined) {
      console.error(
        "[Invalid Environment] BoardCard isn't exist, You need to initialize game."
      );
      return false;
    }
    this.boardCards = shuffle(this.boardCards);
    return true;
  }

  openBoardCards() {
    if (this.boardCards === undefined) {
      console.error(
        "[Invalid Environment] BoardCard isn't exist, You need to initialize game."
      );
      return false;
    }
    const desiredOpen: { [key in CardType]: number } = {
      Tier1: 4,
      Tier2: 4,
      Tier3: 4,
      Rare: 1,
      Legendary: 1,
    };
    const curOpen: { [key in CardType]: number } = {
      Tier1: 0,
      Tier2: 0,
      Tier3: 0,
      Rare: 0,
      Legendary: 0,
    };
    this.boardCards.forEach((boardCard) => {
      if (boardCard.open) {
        curOpen[boardCard.type]++;
      }
    });
    this.boardCards.forEach((boardCard) => {
      const type = boardCard.type;
      const isOpen = boardCard.open;
      if (!isOpen && curOpen[type] < desiredOpen[type]) {
        curOpen[type]++;
        boardCard.open = true;
      }
    });
    return true;
  }

  evolvePokemonCard(playerIdx: number, srcCardId: number, tgtCardId: number) {
    const player = this.players[playerIdx];

    // [validation]

    // 1. check whether boardCard exist
    if (this.boardCards === undefined) {
      console.error(
        "[Invalid Environment] BoardCard isn't exist, You need to initialize game."
      );
      return false;
    }

    // 2. check whether source card exist
    const srcCard = cards[srcCardId];
    if (srcCard === undefined) {
      console.error(
        `[Invalid Input] source card(${srcCardId}) isn't exist in game`
      );
      return false;
    }

    let isSrcInPlayerHand = false;
    for (let playerCard of player.capturedCards) {
      if (srcCardId === playerCard.id) {
        isSrcInPlayerHand = true;
        break;
      }
    }

    if (!isSrcInPlayerHand) {
      console.error(
        `[Invalid Input] Source Pokemon card(${srcCardId}) isn't exist`
      );
      return false;
    }

    // 3. check whether target card exist
    const tgtCard = cards[tgtCardId];
    if (tgtCard === undefined) {
      console.error(
        `[Invalid Input] target card(${tgtCardId}) isn't exist in game`
      );
      return false;
    }

    let isTgtInBoard = false;
    for (let boardCard of this.boardCards) {
      if (tgtCardId === boardCard.id) {
        isTgtInBoard = true;
        break;
      }
    }

    let isTgtInPlayerHand = false;
    for (let playerCard of player.resevedCards) {
      if (tgtCardId === playerCard.id) {
        isTgtInPlayerHand = true;
        break;
      }
    }

    if (!isTgtInBoard && !isTgtInPlayerHand) {
      console.error(
        `[Invalid Input] Target Pokemon card(${tgtCardId}) isn't exist`
      );
      return false;
    }

    if (isTgtInBoard && isTgtInPlayerHand) {
      console.error(
        `[Invalid Input] Target Pokemon card(${tgtCardId}) is exist both(board, player hand)`
      );
      return false;
    }

    // 4. check whether player has enough balls for evolving this card.
    if (
      !player.getDiscountBallCollection()[">="](srcCard.neededBallsForEvolution)
    ) {
      console.error(
        `[Invalid Input] player(${playerIdx})'s ball isn't enough to evolve to target card(${tgtCardId})`
      );
      return false;
    }

    // [update]
    // if target card is in board,
    // - migrate player's source card to evolved card
    // - add evolved card to player
    // - remove target board card in board
    // - open one more card
    if (isTgtInBoard) {
      player.capturedCards = player.capturedCards.filter(
        (card) => card.id !== srcCardId
      );
      player.usedByEvolutionCards.push(srcCard);

      player.capturedCards.push(tgtCard);

      this.boardCards = this.boardCards.filter((bc) => bc.id !== tgtCardId);

      this.openBoardCards();
    }
    // if target card is in player hand,
    // - migrate player's source card to evolved card
    // - add evolved card to player
    // - remove target board card in hand (reserved)
    else {
      player.capturedCards = player.capturedCards.filter(
        (card) => card.id !== srcCardId
      );
      player.usedByEvolutionCards.push(srcCard);

      player.capturedCards.push(tgtCard);

      player.resevedCards = player.resevedCards.filter(
        (card) => card.id !== tgtCardId
      );
    }
    return true;
  }
}

export default Game;
