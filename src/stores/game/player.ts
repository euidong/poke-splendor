import { IBallCollection, BallCollection } from "./ballCollection";
import { CharacterType, CharacterTypes } from "./character";
import { BallType } from "./ball";
import { ICard } from "./card";

interface IPlayer {
  character: CharacterType;
  capturedCards: ICard[];
  resevedCards: ICard[];
  ballCollection: IBallCollection;
  usedByEvolutionCards: ICard[];
  // caculation
  getScore: () => number;
  getDiscountBalls: () => BallCollection;
  getEvolutionCnt: () => number;
}

class Player implements IPlayer {
  character: CharacterType;
  capturedCards: ICard[];
  resevedCards: ICard[];
  ballCollection: IBallCollection;
  usedByEvolutionCards: ICard[];

  constructor(id: number) {
    this.character = CharacterTypes[id]; // TODO: id가 0~3 사이라고 가정. 후에 Random 적용도 고려
    this.capturedCards = [];
    this.resevedCards = [];
    this.ballCollection = new BallCollection({
      pokeBall: 0,
      greatBall: 0,
      ultraBall: 0,
      healBall: 0,
      quickBall: 0,
      masterBall: 0,
    });
    this.usedByEvolutionCards = [];
  }

  getScore = () => {
    let score = 0;
    this.capturedCards.forEach((card) => {
      score += card.score;
    });
    return score;
  };

  getDiscountBalls = () => {
    const bc = new BallCollection({
      masterBall: 0,
      ultraBall: 0,
      healBall: 0,
      quickBall: 0,
      greatBall: 0,
      pokeBall: 0,
    });

    this.capturedCards.forEach((card) => {
      (Object.keys(bc.balls) as BallType[]).forEach((key) => {
        bc.balls[key] += card.rewardBalls.balls[key];
      });
    });

    return bc;
  };

  getEvolutionCnt = () => {
    return this.usedByEvolutionCards.length;
  };
}

export type { IPlayer };
export { Player };
