import styles from "./Card.module.scss";
import { BallType } from "../../stores/game/ball";
import {
  ballTypeToColor,
  pokeNoToName,
  pokeNoToNextEvolutionPokemonNo,
  pokeNoToUrl,
} from "../../utils";
import { CardProps } from "./type";
import Ball from "./Ball";

const CardFront = ({
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
}: Omit<CardProps, "side">) => {
  const nextEvolutionPokemonNo = pokeNoToNextEvolutionPokemonNo(pokemon_no);
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
      style={{ backgroundColor: ballTypeToColor(reward_ball_type, false) }}
    >
      <header
        className={styles["card--front__header"]}
        style={{ backgroundColor: ballTypeToColor(reward_ball_type, true) }}
      >
        <div className={styles["card--front__header__score"]}>{score}</div>
        {nextEvolutionPokemonNo && (
          <div className={styles["card--front__header__evolution"]}>
            <div className={styles["card--front__header__evolution__result"]}>
              <img
                src={pokeNoToUrl(nextEvolutionPokemonNo)}
                alt={`Next Evolution pokemon is ${pokemonName}`}
              />
            </div>
            <Ball cnt={evolution_ball_cnt} type={evolution_ball_type} />
          </div>
        )}
        <div className={styles["card--front__header__reward"]}>
          <Ball cnt={reward_ball_cnt} type={reward_ball_type} />
        </div>
      </header>
      <section className={styles["card--front__body"]}>
        <img
          src={pokeNoToUrl(pokemon_no)}
          alt={`current pokemon is ${pokemonName}`}
        />
      </section>
      <footer className={styles["card--front__footer"]}>
        <div className={styles["card--front__footer__capture"]}>
          <div className={styles["card--front__footer__capture__ball_wrapper"]}>
            {requiredBalls.map(
              (b, idx) =>
                b.cnt > 0 && <Ball key={idx} cnt={b.cnt} type={b.type} />
            )}
          </div>
        </div>
        <div className={styles["card--front__footer__name"]}>{pokemonName}</div>
      </footer>
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

export default CardFront;
