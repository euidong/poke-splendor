import { makeAutoObservable } from "mobx";

import {
  cards,
  desiredInitialBoardBallCollectionsPerPlayerNums,
  desiredOpenCardNumInBoard,
  emptyBallCollection,
} from "../const";
import { shuffle } from "../../utils";
import { CardType, BoardCard, Card } from "./card";
import { Player, IPlayer } from "./player";
import { BallCollection, IBallCollection } from "./ballCollection";

// TODO: erase every `console.error` line.
class Game {
  numPlayers?: 2 | 3 | 4 = undefined;
  boardBallCollection?: BallCollection = undefined;
  boardCards?: BoardCard[] = undefined;
  round?: number = undefined;
  turn?: number = undefined;
  players: IPlayer[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  init(numPlayers: 2 | 3 | 4) {
    this.numPlayers = numPlayers;
    if (
      this.numPlayers === undefined ||
      this.numPlayers < 2 ||
      this.numPlayers > 4
    ) {
      const err = Error(
        `Number of Players is wrong (numPlayers: {this.numPlayers}`
      );
      console.error(err);
      return err;
    }
    let err = this.initBoard(this.numPlayers);
    if (err) {
      return err;
    }
    this.players = [];
    for (let i = 0; i < this.numPlayers; ++i) {
      this.initPlayer(i as 0 | 1 | 2 | 3);
    }
    this.round = 1;
    this.turn = 0;
    return null;
  }

  initPlayer(id: 0 | 1 | 2 | 3) {
    this.players.push(new Player(id));
    return null;
  }

  initBoard(numPlayers: 2 | 3 | 4) {
    this.boardBallCollection =
      desiredInitialBoardBallCollectionsPerPlayerNums[numPlayers].deepCopy();

    this.boardCards = Object.values(cards).map((card) => ({
      ...card,
      open: false,
    }));

    let err = this.shuffleBoardCards();
    if (err) {
      return err;
    }
    err = this.openBoardCards();
    if (err) {
      return err;
    }
    return null;
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

  modifyBallCollection(playerIdx: number, reqBallCollection: BallCollection) {
    // check minus
    const bcFromBoard = new BallCollection({
      masterball: Math.max(reqBallCollection.balls.masterball, 0),
      pokeball: Math.max(reqBallCollection.balls.pokeball, 0),
      greatball: Math.max(reqBallCollection.balls.greatball, 0),
      ultraball: Math.max(reqBallCollection.balls.ultraball, 0),
      quickball: Math.max(reqBallCollection.balls.quickball, 0),
      healball: Math.max(reqBallCollection.balls.healball, 0),
    });
    const bcFromPlayer = new BallCollection({
      masterball: Math.max(-reqBallCollection.balls.masterball, 0),
      pokeball: Math.max(-reqBallCollection.balls.pokeball, 0),
      greatball: Math.max(-reqBallCollection.balls.greatball, 0),
      ultraball: Math.max(-reqBallCollection.balls.ultraball, 0),
      quickball: Math.max(-reqBallCollection.balls.quickball, 0),
      healball: Math.max(-reqBallCollection.balls.healball, 0),
    });

    const originState = {
      board: this.boardBallCollection?.deepCopy(),
      player: this.players[playerIdx].ballCollection,
    };

    if (bcFromPlayer["!="](emptyBallCollection)) {
      const err = this.sendBallCollection(playerIdx, bcFromPlayer, "Player");
      if (err !== null) {
        return err;
      }
    }

    if (bcFromBoard["!="](emptyBallCollection)) {
      const err = this.sendBallCollection(playerIdx, bcFromBoard, "Board");
      if (err !== null) {
        this.boardBallCollection = originState.board;
        this.players[playerIdx].ballCollection = originState.player;
        return err;
      }
    }

    return null;
  }

  sendBallCollection(
    playerIdx: number,
    reqBallCollection: BallCollection,
    sender: "Board" | "Player"
  ) {
    if (!!!this.boardBallCollection) {
      return new Error(
        "[Invalid Environment] BoardBallCollection isn't exist, You need to initialize game."
      );
    }
    if (playerIdx < 0 || playerIdx >= this.players.length) {
      return new Error(
        `[Invalid Input] playerIdx must be in 0 ~ ${this.players.length}`
      );
    }
    if (playerIdx !== this.turn) {
      return new Error(
        `[Invalid Input] this turn is ${this.turn}, but your player id is ${playerIdx}`
      );
    }
    const player = this.players[playerIdx];

    const totBallCnt = Object.values(reqBallCollection.balls).reduce(
      (acc, cnt) => acc + cnt
    );
    const maxBallCnt = Object.values(reqBallCollection.balls).reduce(
      (acc, cnt) => (acc < cnt ? cnt : acc)
    );
    const minBallCnt = Object.values(reqBallCollection.balls).reduce(
      (acc, cnt) => (acc > cnt ? cnt : acc)
    );
    // minus ballCollection is restricted
    if (minBallCnt < 0) {
      return new Error(
        `[Invalid Input] the number of each balls in reqBallCollection can not be minus`
      );
    }

    let srcBc: BallCollection, tgtBc: BallCollection;
    if (sender === "Board") {
      // the number of master ball must be 0 or 1
      if (reqBallCollection.balls.masterball > 1) {
        return new Error(
          `[Invalid Input] the number of master ball must be 0 or 1`
        );
      }
      // if the number of master ball is 1, then others must be 0
      else if (reqBallCollection.balls.masterball === 1) {
        if (totBallCnt !== 1) {
          return new Error(
            "[Invalid Input] the number of maximum total ball is 1, when you request master ball"
          );
        }
      }
      // if the number of master ball is 0
      else {
        if (totBallCnt > 3) {
          return new Error(
            "[Invalid Input] the sum of the number of ball is 3"
          );
        }
        if (totBallCnt === 3 && maxBallCnt !== 1) {
          return new Error(
            "[Invalid Input] if you choose 3 balls, then you must choose a ball per ball type"
          );
        }
      }
      // the maximum total ball number of each player is 10
      const playerBallCnt = Object.values(player.ballCollection.balls).reduce(
        (acc, cnt) => acc + cnt
      );
      if (totBallCnt + playerBallCnt > 10) {
        return new Error(
          "[Invalid Input] the maximum total ball number of each player is 10"
        );
      }
      srcBc = this.boardBallCollection;
      tgtBc = player.ballCollection;
    } else if (sender === "Player") {
      tgtBc = this.boardBallCollection;
      srcBc = player.ballCollection;
    } else {
      return new Error("[Invalid Input] sender must be Board or Player");
    }

    if (!srcBc[">="](reqBallCollection)) {
      return new Error(
        "[Invalid Input] sender must have more balls compared to request"
      );
    }

    // [update]
    if (sender === "Board") {
      player.ballCollection = tgtBc["+"](reqBallCollection);
      this.boardBallCollection = srcBc["-"](reqBallCollection);
    } else if (sender === "Player") {
      this.boardBallCollection = tgtBc["+"](reqBallCollection);
      player.ballCollection = srcBc["-"](reqBallCollection);
    }
    return null;
  }

  reservePokemonCard(playerIdx: number, cardId: number) {
    if (playerIdx < 0 || playerIdx >= this.players.length) {
      return new Error(
        `[Invalid Input] playerIdx must be in 0 ~ ${this.players.length}`
      );
    }
    if (playerIdx !== this.turn) {
      return new Error(
        `[Invalid Input] this turn is ${this.turn}, but your player id is ${playerIdx}`
      );
    }
    const player = this.players[playerIdx];

    // [validate request]
    // 1. check whether boardCard exist
    if (this.boardCards === undefined) {
      return new Error(
        "[Invalid Environment] BoardCard isn't exist, You need to initialize game."
      );
    }
    // 2. check whether card exist in game or not
    const card = cards[cardId];
    if (card === undefined) {
      return new Error(`[Invalid Input] card(${cardId}) isn't exist in game`);
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
      return new Error(`[Invalid Input] card(${cardId}) isn't exist in board`);
    }
    // 4. check whether card is opened or not
    if (!boardCard.open) {
      return new Error(`[Invalid Input] card(${cardId}) isn't open in board`);
    }

    // [update]
    player.resevedCards = [...player.resevedCards, card];
    this.boardCards = this.boardCards.filter((bc) => boardCard?.id !== bc.id);
    this.openBoardCards();

    return null;
  }

  capturePokemonCard(
    playerIdx: number,
    costBallCollection: IBallCollection,
    cardId: number
  ) {
    if (playerIdx < 0 || playerIdx >= this.players.length) {
      return new Error(
        `[Invalid Input] playerIdx must be in 0 ~ ${this.players.length}`
      );
    }
    if (playerIdx !== this.turn) {
      return new Error(
        `[Invalid Input] this turn is ${this.turn}, but your player id is ${playerIdx}`
      );
    }
    const player = this.players[playerIdx];

    // [validate request]
    // 1. check whether boardCard exist
    if (this.boardCards === undefined) {
      return new Error(
        "[Invalid Environment] BoardCard isn't exist, You need to initialize game."
      );
    }
    // 2. check whether board ballcollection exist
    if (this.boardBallCollection === undefined) {
      return new Error(
        "[Invalid Environment] BoardBallCollection isn't exist, You need to initialize game."
      );
    }
    // 3. check whether card exist in game or not
    const card = cards[cardId];
    if (card === undefined) {
      return new Error(`[Invalid Input] card(${cardId}) isn't exist in game`);
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
      return new Error(
        `[Invalid Input] card(${cardId}) isn't exist in board and player hands`
      );
    }
    if (boardCard !== undefined && !boardCard.open) {
      return new Error(`[Invalid Input] card(${cardId}) isn't open`);
    }
    // 5. check whether player has costing balls sent as a param
    if (!player.ballCollection[">="](costBallCollection)) {
      return new Error(
        `[Invalid Input] player(${playerIdx})'s cost balls are invalid (not enough)`
      );
    }

    // 6. check whether player has enough balls for buying this card.
    const srcBallCollection = costBallCollection["+"](
      player.getDiscountBallCollection()
    );
    const extraMasterballCnt = Math.max(
      0,
      srcBallCollection.balls.masterball -
        card.neededBallsForCapturing.balls.masterball
    );
    const remainBallCnt = Object.values(
      card.neededBallsForCapturing["-"](srcBallCollection).balls
    ).reduce((acc, value) => acc + value);

    if (extraMasterballCnt < remainBallCnt) {
      return new Error(
        `[Invalid Input] inputed cost ball(${costBallCollection.balls}) isn't enough to buy card(${cardId})`
      );
    }

    // [update]
    const err = this.sendBallCollection(
      playerIdx,
      costBallCollection,
      "Player"
    );
    if (err !== null) {
      return err;
    }

    player.capturedCards = [...player.capturedCards, card];
    this.boardCards = this.boardCards.filter((bc) => card.id !== bc.id);
    this.openBoardCards();
    player.resevedCards = player.resevedCards.filter((rc) => card.id !== rc.id);

    return null;
  }

  evolvePokemonCard(playerIdx: number, srcCardId: number, tgtCardId: number) {
    if (playerIdx < 0 || playerIdx >= this.players.length) {
      return new Error(
        `[Invalid Input] playerIdx must be in 0 ~ ${this.players.length}`
      );
    }
    if (playerIdx !== this.turn) {
      return new Error(
        `[Invalid Input] this turn is ${this.turn}, but your player id is ${playerIdx}`
      );
    }

    const player = this.players[playerIdx];

    // [validation]

    // 1. check whether boardCard exist
    if (this.boardCards === undefined) {
      return new Error(
        "[Invalid Environment] BoardCard isn't exist, You need to initialize game."
      );
    }

    // 2. check whether source card exist
    const srcCard = cards[srcCardId];
    if (srcCard === undefined) {
      return new Error(
        `[Invalid Input] source card(${srcCardId}) isn't exist in game`
      );
    }

    let isSrcInPlayerHand = false;
    for (let playerCard of player.capturedCards) {
      if (srcCardId === playerCard.id) {
        isSrcInPlayerHand = true;
        break;
      }
    }

    if (!isSrcInPlayerHand) {
      return new Error(
        `[Invalid Input] Source Pokemon card(${srcCardId}) isn't exist`
      );
    }

    // 3. check whether target card exist
    const tgtCard = cards[tgtCardId];
    if (tgtCard === undefined) {
      return new Error(
        `[Invalid Input] target card(${tgtCardId}) isn't exist in game`
      );
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
      return new Error(
        `[Invalid Input] Target Pokemon card(${tgtCardId}) isn't exist`
      );
    }

    if (isTgtInBoard && isTgtInPlayerHand) {
      return new Error(
        `[Invalid Input] Target Pokemon card(${tgtCardId}) is exist both(board, player hand)`
      );
    }

    for (let bc of this.boardCards) {
      if (bc.id === tgtCardId) {
        if (!bc.open) {
          return new Error(
            `[Invalid Input] Target Pokemon card(${tgtCardId}) is not open`
          );
        }
        break;
      }
    }

    // 4. check whether tgtCard is next evolution of the srcCard
    if (
      cards[srcCardId].pokemon.next_evolution?.no !==
      cards[tgtCardId].pokemon.no
    ) {
      return new Error(
        `[Invalid Input] Target Pokemon card(${tgtCardId}) is not the next evolution of the source pokemon card(${srcCardId})`
      );
    }

    // 5. check whether player has enough balls for evolving this card.
    if (
      !player.getDiscountBallCollection()[">="](srcCard.neededBallsForEvolution)
    ) {
      return new Error(
        `[Invalid Input] player(${playerIdx})'s ball isn't enough to evolve to target card(${tgtCardId})`
      );
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
      player.usedByEvolutionCards = [...player.usedByEvolutionCards, srcCard];

      player.capturedCards = [...player.capturedCards, tgtCard];

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
      player.usedByEvolutionCards = [...player.usedByEvolutionCards, srcCard];

      player.capturedCards = [...player.capturedCards, tgtCard];

      player.resevedCards = player.resevedCards.filter(
        (card) => card.id !== tgtCardId
      );
    }
    return null;
  }

  shuffleBoardCards() {
    if (this.boardCards === undefined) {
      const err = new Error(
        "[Invalid Environment] BoardCard isn't exist, You need to initialize game."
      );
      console.error(err);
      return err;
    }
    this.boardCards = shuffle(this.boardCards);
    return null;
  }

  openBoardCards() {
    if (this.boardCards === undefined) {
      const err = new Error(
        "[Invalid Environment] BoardCard isn't exist, You need to initialize game."
      );
      console.error(err);
      return err;
    }

    const curOpenCardNumInBoard: { [key in CardType]: number } = {
      Tier1: 0,
      Tier2: 0,
      Tier3: 0,
      Rare: 0,
      Legendary: 0,
    };
    this.boardCards.forEach((boardCard) => {
      if (boardCard.open) {
        curOpenCardNumInBoard[boardCard.type]++;
      }
    });

    this.boardCards.forEach((boardCard) => {
      const type = boardCard.type;
      const isOpen = boardCard.open;
      if (
        !isOpen &&
        curOpenCardNumInBoard[type] < desiredOpenCardNumInBoard[type]
      ) {
        curOpenCardNumInBoard[type]++;
        boardCard.open = true;
      }
    });

    return null;
  }
}

export default Game;
