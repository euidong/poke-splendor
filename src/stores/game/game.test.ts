import Game from ".";
import {
  cards,
  desiredInitialBoardBallCollectionsPerPlayerNums,
  desiredOpenCardNumInBoard,
  desiredPlayerNums,
  emptyBallCollection,
  loadConstsAsync,
} from "../const";
import { BallTypes } from "./ball";
import { BallCollection } from "./ballCollection";
import { BoardCard, CardType } from "./card";
import { CharacterType } from "./character";

beforeAll(async () => {
  return await loadConstsAsync(true);
});

const initTest = describe("Game Init Test", () => {
  let game: Game = new Game();

  desiredPlayerNums.forEach((playerNum) => {
    test(`with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      // 1. [check initial board stat]
      // 1-1. check boardBallCollection existence
      const bc = game.boardBallCollection;
      expect(bc).not.toBeUndefined();

      // 1-2. check boardBallCollection's initial status
      const isBoardBallCollectionEqual = (bc as BallCollection)["=="](
        desiredInitialBoardBallCollectionsPerPlayerNums[
          playerNum as keyof typeof desiredInitialBoardBallCollectionsPerPlayerNums
        ]
      );
      expect(isBoardBallCollectionEqual).toBeTruthy();

      // 1-3. check boardCards existence
      const bcs = game.boardCards;
      expect(bcs).not.toBeUndefined();

      // 1-4. check the number of initially opened boardCards
      const curOpenCardNumInBoard: { [key in CardType]: number } = {
        Tier1: 0,
        Tier2: 0,
        Tier3: 0,
        Rare: 0,
        Legendary: 0,
      };
      (bcs as BoardCard[]).forEach((boardCard) => {
        if (boardCard.open) {
          curOpenCardNumInBoard[boardCard.type]++;
        }
      });
      Object.keys(curOpenCardNumInBoard).forEach((key) => {
        expect(curOpenCardNumInBoard[key as CardType]).toBe(
          desiredOpenCardNumInBoard[key as CardType]
        );
      });

      // 2. [check the initial player stat]
      // 2-1. check the number of players
      expect(game.players.length).toBe(playerNum);
      // 2-2. check duplication of player.character
      const playerCharacterName: { [key in CharacterType]: number } = {
        Ash: 0,
        Misty: 0,
        Brock: 0,
        Rocket: 0,
      };
      game.players.forEach((player) => {
        playerCharacterName[player.character] += 1;
      });
      Object.values(playerCharacterName).forEach((value) => {
        expect(value).toBeLessThan(2);
      });

      // 3. [check the round and turn]
      expect(game.turn).toBe(0);
      expect(game.round).toBe(1);
    });
  });
});

const functionTest = describe("Game Function Test", () => {
  let game: Game = new Game();

  desiredPlayerNums.forEach((playerNum) => {
    test(`sendBallCollection Input(playerIdx) validation with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      const exampleBc = new BallCollection({
        masterball: 1,
        pokeball: 0,
        greatball: 0,
        ultraball: 0,
        healball: 0,
        quickball: 0,
      });
      const tgts = ["Board", "Player"];
      tgts.forEach((tgt) => {
        // 1. (invalid) playerIdx is minus
        expect(
          game.sendBallCollection(-1, exampleBc, tgt as "Board" | "Player")
        ).not.toBeNull();
        // 2. (invalid) playerIdx is equivalent with playerNum
        expect(
          game.sendBallCollection(
            playerNum,
            exampleBc,
            tgt as "Board" | "Player"
          )
        ).not.toBeNull();
        // 3. (invalid) playerIdx is greater than to playerNum
        expect(
          game.sendBallCollection(
            playerNum + 1,
            exampleBc,
            tgt as "Board" | "Player"
          )
        ).not.toBeNull();

        // 4. (invalid) not my turn
        expect(
          game.sendBallCollection(1, exampleBc, tgt as "Board" | "Player")
        ).not.toBeNull();

        // 5. (valid) input example
        expect(
          game.sendBallCollection(0, exampleBc, tgt as "Board" | "Player")
        ).toBeNull();
      });
    });

    test(`sendBallCollection Input(ballCollection) validation with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      const playerIdx = 0;

      // 1. (invalid) at least one ball type has minus value (board->player, player->board)
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({ ...emptyBallCollection.balls, pokeball: -1 }),
          "Board"
        )
      ).not.toBeNull();
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({ ...emptyBallCollection.balls, pokeball: -1 }),
          "Player"
        )
      ).not.toBeNull();
      // 2. (invalid) more than 2 balls in masterball type (board->player)
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({ ...emptyBallCollection.balls, masterball: 2 }),
          "Board"
        )
      ).not.toBeNull();
      // 3. (invalid) more than 2 types, when masterball exist at least one (board->player)
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({
            ...emptyBallCollection.balls,
            masterball: 1,
            pokeball: 1,
          }),
          "Board"
        )
      ).not.toBeNull();
      // 4. (invalid) more than 3 balls (board->player)
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({
            ...emptyBallCollection.balls,
            pokeball: 4,
          }),
          "Board"
        )
      ).not.toBeNull();
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({
            ...emptyBallCollection.balls,
            pokeball: 1,
            greatball: 1,
            ultraball: 1,
            quickball: 1,
          }),
          "Board"
        )
      ).not.toBeNull();
      // 5. (invalid) if you choose 3 balls, then each ball type must not be same (board->player)
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({
            ...emptyBallCollection.balls,
            pokeball: 2,
            greatball: 1,
          }),
          "Board"
        )
      ).not.toBeNull();

      // 6. (invalid) the maximum total ball number of each player is 10 (board->player)
      game.players[playerIdx].ballCollection.balls.pokeball = 10;
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({ ...emptyBallCollection.balls, pokeball: 1 }),
          "Board"
        )
      ).not.toBeNull();
      game.players[playerIdx].ballCollection.balls.pokeball = 0;

      // 7. (invalid) sender is not affordable to send request (board->player, player->board)
      const temp = game.boardBallCollection!.balls.pokeball;
      game.boardBallCollection!.balls.pokeball = 0;
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({ ...emptyBallCollection.balls, pokeball: 1 }),
          "Board"
        )
      ).not.toBeNull();
      game.boardBallCollection!.balls.pokeball = temp;
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({ ...emptyBallCollection.balls, pokeball: 1 }),
          "Player"
        )
      ).not.toBeNull();

      // 8. (valid) a master ball selection (board->player, player->board)
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({
            ...emptyBallCollection.balls,
            masterball: 1,
          }),
          "Board"
        )
      ).toBeNull();
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({
            ...emptyBallCollection.balls,
            masterball: 1,
          }),
          "Player"
        )
      ).toBeNull();

      expect(
        game.boardBallCollection?.["=="](
          desiredInitialBoardBallCollectionsPerPlayerNums[playerNum]
        )
      ).toBeTruthy();
      expect(
        game.players[playerIdx].ballCollection["=="](emptyBallCollection)
      ).toBeTruthy();

      // 9. (valid) three balls selection when the types of each ball is different and they exclude masterball (board->player, player->board)
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({
            ...emptyBallCollection.balls,
            pokeball: 1,
            greatball: 1,
            ultraball: 1,
          }),
          "Board"
        )
      ).toBeNull();
      expect(
        game.sendBallCollection(
          playerIdx,
          new BallCollection({
            ...emptyBallCollection.balls,
            pokeball: 1,
            greatball: 1,
            ultraball: 1,
          }),
          "Player"
        )
      ).toBeNull();

      expect(
        game.boardBallCollection?.["=="](
          desiredInitialBoardBallCollectionsPerPlayerNums[playerNum]
        )
      ).toBeTruthy();
      expect(
        game.players[playerIdx].ballCollection["=="](emptyBallCollection)
      ).toBeTruthy();
    });

    test(`modifyBallCollection Input(ballCollection) validation with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      const playerIdx = 0;

      game.boardBallCollection!.balls.pokeball -= 4;
      game.players[playerIdx].ballCollection.balls.pokeball += 4;

      game.boardBallCollection!.balls.greatball -= 3;
      game.players[playerIdx].ballCollection.balls.greatball += 3;

      game.boardBallCollection!.balls.ultraball -= 3;
      game.players[playerIdx].ballCollection.balls.ultraball += 3;

      // (invalid) player has more than 11 balls (> 10)
      expect(
        game.modifyBallCollection(
          playerIdx,
          new BallCollection({
            pokeball: -1,
            greatball: 0,
            ultraball: 0,
            quickball: 2,
            healball: 0,
            masterball: 0,
          })
        )
      ).not.toBeNull();
      // (valid) player has 9 balls (< 10)
      expect(
        game.modifyBallCollection(
          playerIdx,
          new BallCollection({
            pokeball: -1,
            greatball: -1,
            ultraball: -1,
            quickball: 2,
            healball: 0,
            masterball: 0,
          })
        )
      ).toBeNull();
    });

    test(`reservePokemonCard Input(playerIdx) validation with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      const exampleCardId = game.boardCards!.filter((card) => card.open)[0].id;

      // 1. (invalid) playerIdx is minus
      expect(game.reservePokemonCard(-1, exampleCardId)).not.toBeNull();
      // 2. (invalid) playerIdx is equivalent with playerNum
      expect(game.reservePokemonCard(playerNum, exampleCardId)).not.toBeNull();
      // 3. (invalid) playerIdx is greater than to playerNum
      expect(
        game.reservePokemonCard(playerNum + 1, exampleCardId)
      ).not.toBeNull();
      // 4. (invalid) not my turn
      expect(game.reservePokemonCard(1, exampleCardId)).not.toBeNull();
      // 5. (valid) input example
      expect(game.reservePokemonCard(0, exampleCardId)).toBeNull();
    });

    test(`reservePokemonCard Input(cardId) validation with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      const playerIdx = 0;

      const totCards = Object.values(cards).sort((a, b) =>
        a.id < b.id ? -1 : 1
      );
      // (invalid) cardId out of range
      const outOfRangeCardId = totCards[totCards.length - 1].id + 1;
      expect(
        game.reservePokemonCard(playerIdx, outOfRangeCardId)
      ).not.toBeNull();
      const minusCardId = -1;
      expect(game.reservePokemonCard(playerIdx, minusCardId)).not.toBeNull();

      const zeroCardId = 0;
      expect(game.reservePokemonCard(playerIdx, zeroCardId)).not.toBeNull();

      // (invalid) card not exist in the board
      const dummyCard = game.boardCards!.pop();
      expect(game.reservePokemonCard(playerIdx, dummyCard!.id)).not.toBeNull();
      game.boardCards!.push(dummyCard!);

      // (invalid) card not opened
      const unopenCardId = game.boardCards!.filter((card) => !card.open)[0].id;
      expect(game.reservePokemonCard(playerIdx, unopenCardId)).not.toBeNull();

      // (valid) select a card in the board
      const openCardId = game.boardCards!.filter((card) => card.open)[0].id;
      expect(game.reservePokemonCard(playerIdx, openCardId)).toBeNull();
      expect(game.players[playerIdx].resevedCards.length).toBe(1);
      expect(game.boardCards!.length).toBe(totCards.length - 1);
      expect(game.boardCards!.filter((card) => card.open).length).toBe(14);
    });

    test(`capturePokemonCard with Input(playerIdx) validation with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      const exampleCard = game.boardCards!.filter(
        (card) => card.open && card.type === "Tier1"
      )[0];
      const exampleCardId = exampleCard.id;
      const exampleCostBc = exampleCard.neededBallsForCapturing;
      const examplePlayerIdx = 0;
      game.boardBallCollection = game.boardBallCollection!["-"](exampleCostBc);
      game.players[examplePlayerIdx].ballCollection =
        game.players[examplePlayerIdx].ballCollection["+"](exampleCostBc);

      // 1. (invalid) playerIdx is minus
      expect(
        game.capturePokemonCard(-1, exampleCostBc, exampleCardId)
      ).not.toBeNull();
      // 2. (invalid) playerIdx is equivalent with playerNum
      expect(
        game.capturePokemonCard(playerNum, exampleCostBc, exampleCardId)
      ).not.toBeNull();
      // 3. (invalid) playerIdx is greater than to playerNum
      expect(
        game.capturePokemonCard(playerNum + 1, exampleCostBc, exampleCardId)
      ).not.toBeNull();
      // 4. (invalid) not my turn
      game.boardBallCollection = game.boardBallCollection!["-"](exampleCostBc);
      game.players[examplePlayerIdx + 1].ballCollection =
        game.players[examplePlayerIdx + 1].ballCollection["+"](exampleCostBc);
      expect(
        game.capturePokemonCard(
          examplePlayerIdx + 1,
          exampleCostBc,
          exampleCardId
        )
      ).not.toBeNull();
      // 5. (valid) input example
      expect(
        game.capturePokemonCard(examplePlayerIdx, exampleCostBc, exampleCardId)
      ).toBeNull();
    });

    test(`capturePokemonCard with Input(cardId) validation with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      const playerIdx = 0;
      const exampleOpenCard = game.boardCards!.filter((card) => card.open)[0];
      const exampleOpenCardId = exampleOpenCard.id;
      const exampleOpenCardCostBc = exampleOpenCard.neededBallsForCapturing;
      game.boardBallCollection = game.boardBallCollection!["-"](
        exampleOpenCardCostBc
      );
      game.players[playerIdx].ballCollection = game.players[
        playerIdx
      ].ballCollection["+"](exampleOpenCardCostBc);

      const totCards = Object.values(cards).sort((a, b) =>
        a.id < b.id ? -1 : 1
      );
      // (invalid) cardId out of range
      const outOfRangeCardId = totCards[totCards.length - 1].id + 1;
      expect(
        game.capturePokemonCard(
          playerIdx,
          exampleOpenCardCostBc,
          outOfRangeCardId
        )
      ).not.toBeNull();
      const minusCardId = -1;
      expect(
        game.capturePokemonCard(playerIdx, exampleOpenCardCostBc, minusCardId)
      ).not.toBeNull();

      const zeroCardId = 0;
      expect(
        game.capturePokemonCard(playerIdx, exampleOpenCardCostBc, zeroCardId)
      ).not.toBeNull();

      // (invalid) card not exist in the board or player hands
      game.boardCards = game.boardCards!.filter(
        (card) => card.id !== exampleOpenCardId
      );
      expect(
        game.capturePokemonCard(
          playerIdx,
          exampleOpenCardCostBc,
          exampleOpenCardId
        )
      ).not.toBeNull();
      game.boardCards!.push(exampleOpenCard);

      game.boardBallCollection = game.boardBallCollection!["+"](
        exampleOpenCardCostBc
      );
      game.players[playerIdx].ballCollection = game.players[
        playerIdx
      ].ballCollection["-"](exampleOpenCardCostBc);

      // (invalid) card in the board, but not opened
      const exampleUnopenCard = game.boardCards!.filter(
        (card) => !card.open
      )[0];
      const exampleUnopenCardId = exampleUnopenCard.id;
      const exampleUnopenCardCostBc = exampleUnopenCard.neededBallsForCapturing;
      game.boardBallCollection = game.boardBallCollection!["-"](
        exampleUnopenCardCostBc
      );
      game.players[playerIdx].ballCollection = game.players[
        playerIdx
      ].ballCollection["+"](exampleUnopenCardCostBc);

      expect(
        game.capturePokemonCard(
          playerIdx,
          exampleUnopenCardCostBc,
          exampleUnopenCardId
        )
      ).not.toBeNull();
      game.boardBallCollection = game.boardBallCollection!["+"](
        exampleUnopenCardCostBc
      );
      game.players[playerIdx].ballCollection = game.players[
        playerIdx
      ].ballCollection["-"](exampleUnopenCardCostBc);

      // (valid) select a card in the board

      const openCard = game.boardCards!.filter((card) => card.open)[0];
      const openCardId = openCard.id;
      const openCardCostBc = openCard.neededBallsForCapturing;
      game.boardBallCollection = game.boardBallCollection!["-"](openCardCostBc);
      game.players[playerIdx].ballCollection =
        game.players[playerIdx].ballCollection["+"](openCardCostBc);

      expect(
        game.capturePokemonCard(playerIdx, openCardCostBc, openCardId)
      ).toBeNull();
      expect(game.players[playerIdx].capturedCards.length).toBe(1);
      expect(game.boardCards!.length).toBe(totCards.length - 1);
      expect(game.boardCards!.filter((card) => card.open).length).toBe(14);
      expect(
        game.players[playerIdx].ballCollection["=="](emptyBallCollection)
      ).toBeTruthy();

      // (valid) select a card in the hand
      const reserveCard = game.boardCards!.filter((card) => card.open)[0];
      expect(game.reservePokemonCard(playerIdx, reserveCard.id)).toBeNull();

      const reserveCardId = reserveCard.id;
      const reserveCardCostBc = reserveCard.neededBallsForCapturing;
      game.boardBallCollection =
        game.boardBallCollection!["-"](reserveCardCostBc);
      game.players[playerIdx].ballCollection =
        game.players[playerIdx].ballCollection["+"](reserveCardCostBc);

      expect(
        game.capturePokemonCard(playerIdx, reserveCardCostBc, reserveCardId)
      ).toBeNull();
      expect(game.players[playerIdx].capturedCards.length).toBe(2);
      expect(game.players[playerIdx].resevedCards.length).toBe(0);
      expect(game.boardCards!.length).toBe(totCards.length - 2);
      expect(game.boardCards!.filter((card) => card.open).length).toBe(14);
      expect(
        game.players[playerIdx].ballCollection["=="](emptyBallCollection)
      ).toBeTruthy();
    });

    test(`capturePokemonCard with Input(costBallCollection) validation with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      const playerIdx = 0;
      const exampleOpenCard = game.boardCards!.filter((card) => card.open)[0];
      const exampleOpenCardId = exampleOpenCard.id;
      const exampleOpenCardCostBc = exampleOpenCard.neededBallsForCapturing;

      // (invalid) player doesn't have enough balls to pay costBallCollection.
      expect(
        game.capturePokemonCard(
          playerIdx,
          exampleOpenCardCostBc,
          exampleOpenCardId
        )
      ).not.toBeNull();

      game.boardBallCollection = game.boardBallCollection!["-"](
        exampleOpenCardCostBc
      );
      game.players[playerIdx].ballCollection = game.players[
        playerIdx
      ].ballCollection["+"](exampleOpenCardCostBc);
      game.boardBallCollection!.balls.masterball -= 1;
      game.players[playerIdx].ballCollection.balls.masterball += 1;

      // (invalid) costBallCollection that doesn't include masterball is not enough for caputring
      expect(
        game.capturePokemonCard(
          playerIdx,
          emptyBallCollection,
          exampleOpenCardId
        )
      ).not.toBeNull();

      // (invalid) costBallCollection that include masterball is not enough for caputring
      expect(
        game.capturePokemonCard(
          playerIdx,
          new BallCollection({ ...emptyBallCollection.balls, masterball: 1 }),
          exampleOpenCardId
        )
      ).not.toBeNull();

      // (valid) buy Normal (not include masterball)
      expect(
        game.capturePokemonCard(
          playerIdx,
          exampleOpenCardCostBc,
          exampleOpenCardId
        )
      ).toBeNull();
      expect(game.boardCards!.length).toBe(Object.keys(cards).length - 1);
      expect(game.players[playerIdx].capturedCards.length).toBe(1);
      expect(game.boardCards!.filter((card) => card.open).length).toBe(14);
      expect(
        game.players[playerIdx].ballCollection["=="](
          new BallCollection({ ...emptyBallCollection.balls, masterball: 1 })
        )
      ).toBeTruthy();

      // (valid) buy type legendary (include masterball)
      const secondOpenCard = game.boardCards!.filter((card) => card.open)[0];
      const secondOpenCardId = secondOpenCard.id;
      const secondOpenCardCostBc = secondOpenCard.neededBallsForCapturing;

      for (let ballType of BallTypes) {
        if (ballType === "masterball") continue;
        if (secondOpenCardCostBc.balls[ballType] !== 0) {
          secondOpenCardCostBc.balls[ballType] -= 1;
          break;
        }
      }

      game.boardBallCollection =
        game.boardBallCollection!["-"](secondOpenCardCostBc);
      game.players[playerIdx].ballCollection =
        game.players[playerIdx].ballCollection["+"](secondOpenCardCostBc);

      secondOpenCardCostBc.balls["masterball"] += 1;

      expect(
        game.capturePokemonCard(
          playerIdx,
          secondOpenCardCostBc,
          secondOpenCardId
        )
      ).toBeNull();
      expect(game.boardCards!.length).toBe(Object.keys(cards).length - 2);
      expect(game.players[playerIdx].capturedCards.length).toBe(2);
      expect(game.boardCards!.filter((card) => card.open).length).toBe(14);
      expect(
        game.players[playerIdx].ballCollection["=="](emptyBallCollection)
      ).toBeTruthy();
    });

    test(`evolvePokemonCard with Input(playerIdx) validation with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      const playerIdx = 0;

      game.boardCards = game.boardCards!.filter(
        (card) => card.type !== "Tier1"
      );
      game.players[playerIdx].capturedCards = Object.values(cards).filter(
        (card) => card.type === "Tier1"
      );
      const openTier2Card = game.boardCards.filter(
        (card) => card.open && card.type === "Tier2"
      )[0];
      const myTier1Card = game.players[playerIdx].capturedCards.filter(
        (card) => card.pokemon.next_evolution?.no === openTier2Card.pokemon.no
      )[0];

      // 1. (invalid) playerIdx is minus
      expect(
        game.evolvePokemonCard(-1, myTier1Card.id, openTier2Card.id)
      ).not.toBeNull();
      // 2. (invalid) playerIdx is equivalent with playerNum
      expect(
        game.evolvePokemonCard(playerNum, myTier1Card.id, openTier2Card.id)
      ).not.toBeNull();
      // 3. (invalid) playerIdx is greater than to playerNum
      expect(
        game.evolvePokemonCard(playerNum + 1, myTier1Card.id, openTier2Card.id)
      ).not.toBeNull();
      // 4. (invalid) not my turn
      expect(
        game.evolvePokemonCard(playerIdx + 1, myTier1Card.id, openTier2Card.id)
      ).not.toBeNull();
      // 5. (valid) input example
      expect(
        game.evolvePokemonCard(playerIdx, myTier1Card.id, openTier2Card.id)
      ).toBeNull();
    });

    test(`evolvePokemonCard with Input(srcCardId, tgtCardId) validation with ${playerNum} players`, () => {
      // init game with player number
      const err = game.init(playerNum);
      expect(err).toBeNull();

      const playerIdx = 0;

      const openTier2Card = game.boardCards!.filter(
        (card) => card.open && card.type === "Tier2"
      )[0];
      const myTier1Card = Object.values(cards).filter(
        (card) => card.pokemon.next_evolution?.no === openTier2Card.pokemon.no
      )[0];
      game.boardCards = game.boardCards!.filter(
        (card) => card.type !== "Tier1"
      );
      game.players[playerIdx].capturedCards = Object.values(cards).filter(
        (card) => card.type === "Tier1"
      );

      // 1. (invalid) srcCardId or tgtCardId out of range
      const totCards = Object.values(cards).sort((a, b) =>
        a.id < b.id ? -1 : 1
      );
      // (invalid) cardId out of range
      const outOfRangeCardId = totCards[totCards.length - 1].id + 1;
      expect(
        game.evolvePokemonCard(playerIdx, outOfRangeCardId, openTier2Card.id)
      ).not.toBeNull();
      expect(
        game.evolvePokemonCard(playerIdx, myTier1Card.id, outOfRangeCardId)
      ).not.toBeNull();
      const minusCardId = -1;
      expect(
        game.evolvePokemonCard(playerIdx, minusCardId, openTier2Card.id)
      ).not.toBeNull();
      expect(
        game.evolvePokemonCard(playerIdx, myTier1Card.id, minusCardId)
      ).not.toBeNull();

      const zeroCardId = 0;
      expect(
        game.evolvePokemonCard(playerIdx, zeroCardId, openTier2Card.id)
      ).not.toBeNull();
      expect(
        game.evolvePokemonCard(playerIdx, myTier1Card.id, zeroCardId)
      ).not.toBeNull();

      // 2. (invalid) srcCardId not in player's capture stat
      game.players[playerIdx].capturedCards = game.players[
        playerIdx
      ].capturedCards.filter((card) => card.id !== myTier1Card.id);
      expect(
        game.evolvePokemonCard(playerIdx, myTier1Card.id, openTier2Card.id)
      ).not.toBeNull();
      game.players[playerIdx].capturedCards = Object.values(cards).filter(
        (card) => card.type === "Tier1"
      );

      // 3. (invalid) tgtCardId not in the board(or unopen) or player hand
      game.boardCards = game.boardCards!.filter(
        (card) => card.id !== openTier2Card.id
      );
      expect(
        game.evolvePokemonCard(playerIdx, myTier1Card.id, openTier2Card.id)
      ).not.toBeNull();
      game.boardCards.push(openTier2Card);

      openTier2Card.open = false;
      expect(
        game.evolvePokemonCard(playerIdx, myTier1Card.id, openTier2Card.id)
      ).not.toBeNull();
      openTier2Card.open = true;

      // 4. (invalid) tgtCard is not result of the evolution of srcCard
      const invalidOpenTier2Card = game.boardCards!.filter(
        (card) => card.pokemon.no !== myTier1Card.pokemon.next_evolution!.no
      )[0];
      const prevOpen = invalidOpenTier2Card.open;
      invalidOpenTier2Card.open = true;
      expect(
        game.evolvePokemonCard(
          playerIdx,
          myTier1Card.id,
          invalidOpenTier2Card.id
        )
      ).not.toBeNull();
      invalidOpenTier2Card.open = prevOpen;

      // 5. (invalid) player is not affordable to evolve this srcCard (not enough evolutionBallCnt)
      game.players[playerIdx].capturedCards = [myTier1Card];
      expect(
        game.evolvePokemonCard(playerIdx, myTier1Card.id, openTier2Card.id)
      ).not.toBeNull();

      game.players[playerIdx].capturedCards = Object.values(cards).filter(
        (card) => card.type === "Tier1"
      );

      // 6. (valid) player evolve srcCard to tgtCard (case 1: in board, case 2: in hand)
      expect(
        game.evolvePokemonCard(playerIdx, myTier1Card.id, openTier2Card.id)
      ).toBeNull();
      expect(game.players[playerIdx].usedByEvolutionCards.length).toBe(1);
      expect(game.players[playerIdx].capturedCards.length).toBe(
        Object.values(cards).filter((card) => card.type === "Tier1").length
      );
      expect(
        game.boardCards.filter((card) => card.type === "Tier2").length
      ).toBe(
        Object.values(cards).filter((card) => card.type === "Tier2").length - 1
      );
      expect(game.boardCards.filter((card) => card.open).length).toBe(10);

      const reserveTier2Card = game.boardCards.filter(
        (card) => card.open && card.type === "Tier2"
      )[0];
      expect(
        game.reservePokemonCard(playerIdx, reserveTier2Card.id)
      ).toBeNull();
      const myTier1Card2 = game.players[playerIdx].capturedCards.filter(
        (card) =>
          card.pokemon.next_evolution?.no === reserveTier2Card.pokemon.no
      )[0];
      expect(
        game.evolvePokemonCard(playerIdx, myTier1Card2.id, reserveTier2Card.id)
      ).toBeNull();

      expect(game.players[playerIdx].usedByEvolutionCards.length).toBe(2);
      expect(game.players[playerIdx].capturedCards.length).toBe(
        Object.values(cards).filter((card) => card.type === "Tier1").length
      );
      expect(
        game.boardCards.filter((card) => card.type === "Tier2").length
      ).toBe(
        Object.values(cards).filter((card) => card.type === "Tier2").length - 2
      );
      expect(game.boardCards.filter((card) => card.open).length).toBe(10);
    });
  });
});

export { initTest, functionTest };
