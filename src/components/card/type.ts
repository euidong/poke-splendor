import { BallType } from "../../stores/game/ball";
import { CardType } from "../../stores/game/card";

export type CardProps = {
  pokemon_no: number;
  card_type: CardType;
  required_master_ball_cnt: number;
  required_ultra_ball_cnt: number;
  required_heal_ball_cnt: number;
  required_quick_ball_cnt: number;
  required_great_ball_cnt: number;
  required_poke_ball_cnt: number;
  score: number;
  reward_ball_type: BallType;
  reward_ball_cnt: number;
  evolution_ball_type: BallType;
  evolution_ball_cnt: number;
  side: "Front" | "Back";
};
