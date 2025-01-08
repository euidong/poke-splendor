import { IBallCollection, BallCollection } from "./ballCollection";
import { CharacterType, CharacterTypes } from "./character";
import { ICard } from "./card";
import { makeAutoObservable } from "mobx";

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

  constructor(id: 0 | 1 | 2 | 3) {
    this.character = CharacterTypes[id]; // TODO: 후에 Random 적용도 고려
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
    makeAutoObservable(this);
  }

  getScore = () => {
    let score = 0;
    this.capturedCards.forEach((card) => {
      score += card.score;
    });
    return score;
  };

  getDiscountBallCollection = () => {
    let bc = new BallCollection({
      masterball: 0,
      ultraball: 0,
      healball: 0,
      quickball: 0,
      greatball: 0,
      pokeball: 0,
    });

    this.capturedCards.forEach((card) => {
      bc = bc["+"](card.rewardBalls);
    });

    return bc;
  };

  getEvolutionCnt = () => {
    return this.usedByEvolutionCards.length;
  };
}

export type { IPlayer };
export { Player };
