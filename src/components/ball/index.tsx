import styles from "./Ball.module.scss";
import { BallType } from "../../stores/game/ball";
import { ballTypeToColor, ballTypeToUrl } from "../../utils";

type BallProps = {
  ballType: BallType;
};

const Ball = ({ ballType }: BallProps) => {
  return (
    <div
      className={styles["ball"]}
      style={{ backgroundColor: ballTypeToColor(ballType, true) }}
    >
      <div
        className={styles["ball__wrapper"]}
        style={{ backgroundColor: ballTypeToColor(ballType, false) }}
      >
        <img src={ballTypeToUrl(ballType)} alt={ballType} />
      </div>
    </div>
  );
};

export default Ball;
