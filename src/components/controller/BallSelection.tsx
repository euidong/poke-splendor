import styles from "./Controller.module.scss";
import { ActionType } from ".";
import BallCollection from "../ballCollection";
import { createRef } from "react";

type BallSelectionProps = {
  setAction: (action: ActionType) => void;
  moveBack: () => void;
};

const BallSelection = ({ setAction, moveBack }: BallSelectionProps) => {
  const ballCollectionRefs = {
    masterball: createRef<HTMLInputElement>(),
    pokeball: createRef<HTMLInputElement>(),
    greatball: createRef<HTMLInputElement>(),
    ultraball: createRef<HTMLInputElement>(),
    healball: createRef<HTMLInputElement>(),
    quickball: createRef<HTMLInputElement>(),
  };

  return (
    <>
      <div className={styles["controller__body--ball_selection__title"]}>
        Ball Selection
      </div>
      <div className={styles["controller__body--ball_selection__description"]}>
        You can choose Poké Balls to capture Pokémon cards.
      </div>
      <div className={styles["controller__body--ball_selection__content"]}>
        <div
          className={
            styles["controller__body--ball_selection__content__ball_list"]
          }
        >
          <BallCollection
            masterball={0}
            pokeball={0}
            greatball={0}
            ultraball={0}
            healball={0}
            quickball={0}
            refs={ballCollectionRefs}
          />
        </div>
        <div
          className={
            styles["controller__body--ball_selection__content__button_list"]
          }
        >
          <button
            className={
              styles[
                "controller__body--ball_selection__content__button_list__button"
              ]
            }
            onClick={() => moveBack()}
          >
            Cancel
          </button>
          <button
            className={
              styles[
                "controller__body--ball_selection__content__button_list__button"
              ]
            }
            onClick={() =>
              ballCollectionRefs["masterball"].current &&
              Number(ballCollectionRefs.masterball.current.value) > 0
                ? setAction("Reservation")
                : setAction("Evolution")
            }
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default BallSelection;
