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
  getDiscountBallCollection: () => BallCollection;
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
      pokeball: 0,
      greatball: 0,
      ultraball: 0,
      healball: 0,
      quickball: 0,
      masterball: 0,
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

  getDiscountBallCollection = () => {
    const bc = new BallCollection({
      masterball: 0,
      ultraball: 0,
      healball: 0,
      quickball: 0,
      greatball: 0,
      pokeball: 0,
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
