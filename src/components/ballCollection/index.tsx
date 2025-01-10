import styles from "./BallCollection.module.scss";

import { BallTypes, BallType } from "../../stores/game/ball";
import Ball from "../ball";
import { IBallCollection } from "../../stores/game/ballCollection";

type BallCollectionProps = {
  refs?: {
    [key in BallType]: React.RefObject<HTMLInputElement>;
  };
} & {
  [key in BallType]: number;
};

const BallCollection = (props: BallCollectionProps) => {
  return (
    <div className={styles["ball_collection"]}>
      {BallTypes.map((ballType) => (
        <div key={ballType} className={styles["ball_collection__ball"]}>
          <div className={styles["ball_collection__ball__image"]}>
            <Ball ballType={ballType} />
          </div>
          <div className={styles["ball_collection__ball__cnt"]}>
            {props.refs === undefined ? (
              props[ballType]
            ) : (
              <input
                className={styles["ball_collection__ball__cnt__input"]}
                ref={props.refs[ballType]}
                defaultValue={props[ballType]}
                max={9}
                min={-9}
                type="number"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ballCollectionObjectToBallCollectionProps = (
  ballCollection: IBallCollection
): BallCollectionProps => {
  return {
    ...ballCollection.balls,
  };
};

export { ballCollectionObjectToBallCollectionProps };
export type { BallCollectionProps };
export default BallCollection;
