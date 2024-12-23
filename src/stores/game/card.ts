import { IPokemon } from "./pokemon";
import { IBallCollection } from "./ballCollection";

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

  isSame: (card: ICard) => boolean;
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

  isSame = (card: ICard) => {
    if (this.pokemon.no !== card.pokemon.no) return false;
    if (this.score !== card.score) return false;
    return true;
  };
}

type BoardCard = ICard & { open: boolean };

export type { ICard, CardType, BoardCard };
export { Card, CardTypes };
