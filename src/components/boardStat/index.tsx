import styles from "./BoardStat.module.scss";

import { BallTypes, BallType } from "../../stores/game/ball";
import Ball from "../ball";
import { IBallCollection } from "../../stores/game/ballCollection";

type BoardStatProps = {
  [key in BallType]: number;
};

const BoardStat = (props: BoardStatProps) => {
  return (
    <div className={styles["board_stat"]}>
      {BallTypes.map((ballType) => (
        <div className={styles["board_stat__ball"]}>
          <div className={styles["board_stat__ball__image"]}>
            <Ball ballType={ballType} />
          </div>
          <div className={styles["board_stat__ball__cnt"]}>
            {props[ballType]}
          </div>
        </div>
      ))}
    </div>
  );
};

const ballCollectionObjectToBoardStatProps = (
  ballCollection: IBallCollection
): BoardStatProps => {
  return {
    ...ballCollection.balls,
  };
};

export { ballCollectionObjectToBoardStatProps };
export type { BoardStatProps };
export default BoardStat;
