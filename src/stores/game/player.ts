import { IBallCollection, BallCollection } from "./ballCollection";
import { CharacterType, CharacterTypes } from "./character";
import { Card, ICard } from "./card";
import { makeAutoObservable } from "mobx";

interface IPlayer {
  id: 0 | 1 | 2 | 3;
  character: CharacterType;
  capturedCards: ICard[];
  resevedCards: ICard[];
  ballCollection: IBallCollection;
  usedByEvolutionCards: ICard[];
  // caculation
  getScore: () => number;
  getDiscountBallCollection: () => BallCollection;
  getEvolutionCnt: () => number;
  //
  serialization: () => {
    id: 0 | 1 | 2 | 3;
    character: CharacterType;
    capturedCards: any[];
    resevedCards: any[];
    ballCollection: any;
    usedByEvolutionCards: any[];
  };
  deserializtion: (obj: {
    id: 0 | 1 | 2 | 3;
    character: CharacterType;
    capturedCards: any[];
    resevedCards: any[];
    ballCollection: any;
    usedByEvolutionCards: any[];
  }) => IPlayer;
}

class Player implements IPlayer {
  id: 0 | 1 | 2 | 3;
  character: CharacterType;
  capturedCards: ICard[];
  resevedCards: ICard[];
  ballCollection: IBallCollection;
  usedByEvolutionCards: ICard[];

  constructor(id: 0 | 1 | 2 | 3) {
    this.id = id;
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

  serialization = () => ({
    id: this.id,
    character: this.character,
    capturedCards: this.capturedCards.map((card) => card.serialization()),
    resevedCards: this.resevedCards.map((card) => card.serialization()),
    ballCollection: this.ballCollection.serialization(),
    usedByEvolutionCards: this.usedByEvolutionCards.map((card) =>
      card.serialization()
    ),
  });

  deserializtion = (obj: {
    id: 0 | 1 | 2 | 3;
    character: CharacterType;
    capturedCards: any[];
    resevedCards: any[];
    ballCollection: any;
    usedByEvolutionCards: any[];
  }) => {
    return Player.deserializtion(obj);
  };

  static deserializtion = (obj: {
    id: 0 | 1 | 2 | 3;
    character: CharacterType;
    capturedCards: any[];
    resevedCards: any[];
    ballCollection: any;
    usedByEvolutionCards: any[];
  }) => {
    const player = new Player(obj.id);
    player.character = obj.character;
    player.capturedCards = obj.capturedCards.map((card) =>
      Card.deserialization(card)
    );
    player.resevedCards = obj.resevedCards.map((card) =>
      Card.deserialization(card)
    );
    player.ballCollection = BallCollection.deserialization(obj.ballCollection);
    player.usedByEvolutionCards = obj.usedByEvolutionCards.map((card) =>
      Card.deserialization(card)
    );
    return player;
  };
}

export type { IPlayer };
export { Player };
