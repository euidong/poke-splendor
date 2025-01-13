import styles from "./Card.module.scss";
import { BallType } from "../../stores/game/ball";
import { ballTypeToColor, pokeNoToName, pokeNoToUrl } from "../../utils";
import { CardProps } from "./type";
import Ball from "./Ball";

const CardFrontSummary = ({
  pokemon_no,
  required_master_ball_cnt,
  required_ultra_ball_cnt,
  required_heal_ball_cnt,
  required_quick_ball_cnt,
  required_great_ball_cnt,
  required_poke_ball_cnt,
  score,
  reward_ball_type,
  reward_ball_cnt,
  evolution_ball_type,
  evolution_ball_cnt,
  isSelected,
  onClick,
  view,
}: Omit<CardProps, "side">) => {
  const pokemonName = pokeNoToName(pokemon_no);
  const requiredBalls = getRequiredBalls(
    required_master_ball_cnt,
    required_quick_ball_cnt,
    required_heal_ball_cnt,
    required_ultra_ball_cnt,
    required_great_ball_cnt,
    required_poke_ball_cnt
  );

  return (
    <div
      className={styles["card--front"]}
      style={{
        backgroundColor: ballTypeToColor(reward_ball_type, false),
        cursor: onClick ? "pointer" : "default",
        outline: isSelected ? "2px solid red" : "none",
        height: view !== "Full" ? "64px" : "150px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <section className={styles["card--front__body"]}>
        <img
          src={pokeNoToUrl(pokemon_no)}
          alt={`current pokemon is ${pokemonName}`}
        />
        <div className={styles["card--front__body__ball_wrapper"]}>
          {requiredBalls.map(
            (b, idx) =>
              b.cnt > 0 && <Ball key={idx} cnt={b.cnt} type={b.type} />
          )}
        </div>
      </section>
    </div>
  );
};

const getRequiredBalls = (
  required_master_ball_cnt: number,
  required_quick_ball_cnt: number,
  required_heal_ball_cnt: number,
  required_ultra_ball_cnt: number,
  required_great_ball_cnt: number,
  required_poke_ball_cnt: number
): { type: BallType; cnt: number }[] => {
  return [
    { type: "masterball", cnt: required_master_ball_cnt },
    { type: "quickball", cnt: required_quick_ball_cnt },
    { type: "healball", cnt: required_heal_ball_cnt },
    { type: "ultraball", cnt: required_ultra_ball_cnt },
    { type: "greatball", cnt: required_great_ball_cnt },
    { type: "pokeball", cnt: required_poke_ball_cnt },
  ];
};

export default CardFrontSummary;
