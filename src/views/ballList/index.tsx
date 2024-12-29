import styles from "./BallList.module.scss";
import Ball from "../../components/ball";
import { BallTypes } from "../../stores/game/ball";

const BallList = () => {
  return (
    <div className={styles["ball_list"]}>
      <div className={styles["ball_list__title"]}>Ball</div>
      <div className={styles["ball_list__wrapper"]}>
        {BallTypes.map((ballType) => (
          <Ball ballType={ballType} />
        ))}
      </div>
    </div>
  );
};

export default BallList;
