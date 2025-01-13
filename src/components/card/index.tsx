import { useState } from "react";
import { BallType } from "../../stores/game/ball";
import { ICard } from "../../stores/game/card";
import CardBack from "./back";
import CardFront from "./front";
import CardFrontSummary from "./frontSummary";
import { CardProps } from "./type";

const Card = ({ side, view, ...props }: CardProps) => {
  const [temporalView, setTemporalView] = useState<
    "Full" | "Summary" | undefined
  >(view);

  if (side === "Front" && temporalView === "Full")
    return (
      <CardFront
        {...props}
        onClick={() => {
          if (props.onClick) {
            props.onClick && props.onClick();
          } else {
            setTemporalView("Summary");
          }
        }}
      />
    );
  else if (side === "Front")
    return (
      <CardFrontSummary
        {...props}
        onClick={() => {
          if (props.onClick) {
            props.onClick();
          } else {
            setTemporalView("Full");
          }
        }}
      />
    );
  else return <CardBack {...props} />;
};

const cardObjectToCardProps = (
  card: ICard,
  side: "Front" | "Back"
): CardProps => {
  let evolution_ball_type: BallType = "masterball";
  let evolution_ball_cnt: number = 0;
  let reward_ball_type: BallType = "masterball";
  let reward_ball_cnt: number = 0;
  Object.entries(card.neededBallsForEvolution.balls).forEach(([ball, cnt]) => {
    if (cnt !== 0) {
      evolution_ball_type = ball as BallType;
      evolution_ball_cnt = cnt;
    }
  });
  Object.entries(card.rewardBalls.balls).forEach(([ball, cnt]) => {
    if (cnt !== 0) {
      reward_ball_type = ball as BallType;
      reward_ball_cnt = cnt;
    }
  });
  return {
    side: side,
    card_id: card.id,
    card_type: card.type,
    pokemon_no: card.pokemon.no,
    required_master_ball_cnt: card.neededBallsForCapturing.balls.masterball,
    required_ultra_ball_cnt: card.neededBallsForCapturing.balls.ultraball,
    required_heal_ball_cnt: card.neededBallsForCapturing.balls.healball,
    required_quick_ball_cnt: card.neededBallsForCapturing.balls.quickball,
    required_great_ball_cnt: card.neededBallsForCapturing.balls.greatball,
    required_poke_ball_cnt: card.neededBallsForCapturing.balls.pokeball,
    score: card.score,
    reward_ball_type: reward_ball_type,
    reward_ball_cnt: reward_ball_cnt,
    evolution_ball_type: evolution_ball_type,
    evolution_ball_cnt: evolution_ball_cnt,
  };
};

export default Card;

export { cardObjectToCardProps };
