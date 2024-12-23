import { BallType } from "../../../stores/game/ball";
import { ballTypeToUrl } from "../../../utils";
import styles from "./Ball.module.scss";

type BallProps = {
  cnt: number;
  type: BallType;
};

const Ball = ({ cnt, type }: BallProps) => {
  return (
    <div className={styles["ball"]}>
      <div className={styles["ball__cnt"]}>{cnt}</div>
      <div className={styles["ball__image_wrapper"]}>
        <img src={ballTypeToUrl(type)} alt={type} />
      </div>
    </div>
  );
};

export default Ball;
export type { BallProps };
