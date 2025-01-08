import { shuffle } from "../../utils";
import { cards, emptyBallCollection, loadConstsAsync } from "../const";
import { Card } from "./card";
import { Player } from "./player";

beforeAll(async () => {
  return await loadConstsAsync(true);
});

const initTest = describe("Player Init Test", () => {
  const players = [0, 1, 2, 3].map((idx) => new Player(idx as 0 | 1 | 2 | 3));

  players.forEach((player, idx) => {
    test(`player idx=${idx}`, () => {
      expect(player.resevedCards.length).toBe(0);
      expect(player.capturedCards.length).toBe(0);
      expect(player.usedByEvolutionCards.length).toBe(0);
      expect(player.character).not.toBeUndefined();
      expect(player.ballCollection["=="](emptyBallCollection)).toBeTruthy();
    });
  });
});

const functionTest = describe("Player Function Test", () => {
  let player: Player;
  beforeEach(() => {
    player = new Player(0);
  });

  test("getScore", () => {
    const deck = Object.values(cards);
    let score = 0;
    while (deck.length !== 0) {
      shuffle(deck);
      const card = deck.pop();
      expect(card).not.toBeUndefined();
      score += (card as Card).score;
      player.capturedCards.push(card as Card);
      expect(player.getScore()).toBe(score);
    }
  });

  test("getDiscontBallCollection", () => {
    const deck = Object.values(cards);
    let bc = emptyBallCollection.deepCopy();
    while (deck.length !== 0) {
      shuffle(deck);
      const card = deck.pop();
      expect(card).not.toBeUndefined();
      bc = bc["+"]((card as Card).rewardBalls);
      player.capturedCards.push(card as Card);
      expect(player.getDiscountBallCollection()["=="](bc)).toBeTruthy();
    }
  });
});

export { initTest, functionTest };
