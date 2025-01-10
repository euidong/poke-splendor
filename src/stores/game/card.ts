import { IPokemon } from "./pokemon";
import { BallCollection, IBallCollection } from "./ballCollection";

const CardTypes = ["Tier1", "Tier2", "Tier3", "Rare", "Legendary"] as const;
type CardType = (typeof CardTypes)[number];

interface ICard {
  id: number;
  score: number;
  type: CardType;
  pokemon: IPokemon;

  neededBallsForCapturing: IBallCollection;
  neededBallsForEvolution: IBallCollection;
  rewardBalls: IBallCollection;

  serialization: () => any;
  deserialization: (obj: any) => ICard;
}

class Card implements ICard {
  id: number;
  score: number;
  type: CardType;
  pokemon: IPokemon;

  neededBallsForCapturing: IBallCollection;
  neededBallsForEvolution: IBallCollection;
  rewardBalls: IBallCollection;

  constructor(card: {
    id: number;
    score: number;
    type: CardType;
    pokemon: IPokemon;
    neededBallsForCapturing: IBallCollection;
    neededBallsForEvolution: IBallCollection;
    rewardBalls: IBallCollection;
  }) {
    this.id = card.id;
    this.score = card.score;
    this.type = card.type;
    this.pokemon = card.pokemon;
    this.neededBallsForCapturing = card.neededBallsForCapturing;
    this.neededBallsForEvolution = card.neededBallsForEvolution;
    this.rewardBalls = card.rewardBalls;
  }

  serialization = () => ({
    id: this.id,
    score: this.score,
    type: this.type,
    pokemon: this.pokemon,
    neededBallsForCapturing: this.neededBallsForCapturing.serialization(),
    neededBallsForEvolution: this.neededBallsForEvolution.serialization(),
    rewardBalls: this.rewardBalls.serialization(),
  });

  deserialization = (obj: any) => {
    return Card.deserialization(obj);
  };

  static deserialization = (obj: {
    id: number;
    score: number;
    type: CardType;
    pokemon: IPokemon;
    neededBallsForCapturing: any;
    neededBallsForEvolution: any;
    rewardBalls: any;
  }) => {
    return new Card({
      id: obj.id,
      score: obj.score,
      type: obj.type,
      pokemon: obj.pokemon,
      neededBallsForCapturing: BallCollection.deserialization(
        obj.neededBallsForCapturing
      ),
      neededBallsForEvolution: BallCollection.deserialization(
        obj.neededBallsForEvolution
      ),
      rewardBalls: BallCollection.deserialization(obj.rewardBalls),
    });
  };
}

class BoardCard extends Card {
  open: boolean = false;

  serialization = () => ({
    id: this.id,
    open: this.open,
    score: this.score,
    type: this.type,
    pokemon: this.pokemon,
    neededBallsForCapturing: this.neededBallsForCapturing.serialization(),
    neededBallsForEvolution: this.neededBallsForEvolution.serialization(),
    rewardBalls: this.rewardBalls.serialization(),
  });

  deserialization = (obj: any) => {
    return BoardCard.deserialization(obj);
  };

  static deserialization = (obj: any) => {
    const bc = new BoardCard({
      id: obj.id,
      score: obj.score,
      type: obj.type,
      pokemon: obj.pokemon,
      neededBallsForCapturing: BallCollection.deserialization(
        obj.neededBallsForCapturing
      ),
      neededBallsForEvolution: BallCollection.deserialization(
        obj.neededBallsForEvolution
      ),
      rewardBalls: BallCollection.deserialization(obj.rewardBalls),
    });
    bc.open = obj.open;
    return bc;
  };
}

export type { ICard, CardType };
export { Card, CardTypes, BoardCard };
