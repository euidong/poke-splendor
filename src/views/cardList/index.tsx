import styles from "./CardList.module.scss";
import Card from "../../components/card";
import { cards } from "../../stores/const";
import { BallType } from "../../stores/game/ball";
import { CardTypes } from "../../stores/game/card";

const CardList = () => {
  return (
    <div className={styles["card_list"]}>
      {CardTypes.map((cardType) => {
        return (
          <div className={styles["card_list__wrapper"]}>
            <div className={styles["card_list__wrapper__title"]}>
              {cardType}
            </div>
            <div className={styles["card_list__wrapper__cards"]}>
              <Card
                side="Back"
                card_id={1}
                card_type={cardType}
                pokemon_no={1}
                required_master_ball_cnt={0}
                required_ultra_ball_cnt={0}
                required_heal_ball_cnt={0}
                required_quick_ball_cnt={0}
                required_great_ball_cnt={0}
                required_poke_ball_cnt={0}
                score={0}
                reward_ball_type={"masterball"}
                reward_ball_cnt={0}
                evolution_ball_type={"masterball"}
                evolution_ball_cnt={0}
              />
              {Object.values(cards).map((card) => {
                let evolution_ball_type: BallType = "masterball";
                let evolution_ball_cnt: number = 0;
                let reward_ball_type: BallType = "masterball";
                let reward_ball_cnt: number = 0;
                Object.entries(card.neededBallsForEvolution.balls).forEach(
                  ([ball, cnt]) => {
                    if (cnt !== 0) {
                      evolution_ball_type = ball as BallType;
                      evolution_ball_cnt = cnt;
                    }
                  }
                );
                Object.entries(card.rewardBalls.balls).forEach(
                  ([ball, cnt]) => {
                    if (cnt !== 0) {
                      reward_ball_type = ball as BallType;
                      reward_ball_cnt = cnt;
                    }
                  }
                );
                return (
                  card.type === cardType && (
                    <Card
                      side="Front"
                      card_id={card.id}
                      card_type={card.type}
                      pokemon_no={card.pokemon.no}
                      required_master_ball_cnt={
                        card.neededBallsForCapturing.balls.masterball
                      }
                      required_ultra_ball_cnt={
                        card.neededBallsForCapturing.balls.ultraball
                      }
                      required_heal_ball_cnt={
                        card.neededBallsForCapturing.balls.healball
                      }
                      required_quick_ball_cnt={
                        card.neededBallsForCapturing.balls.quickball
                      }
                      required_great_ball_cnt={
                        card.neededBallsForCapturing.balls.greatball
                      }
                      required_poke_ball_cnt={
                        card.neededBallsForCapturing.balls.pokeball
                      }
                      score={card.score}
                      reward_ball_type={reward_ball_type}
                      reward_ball_cnt={reward_ball_cnt}
                      evolution_ball_type={evolution_ball_type}
                      evolution_ball_cnt={evolution_ball_cnt}
                    />
                  )
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardList;
