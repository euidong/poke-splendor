import styles from "./Controller.module.scss";
import { ActionType } from ".";
import BallCollection from "../ballCollection";
import { createRef } from "react";
import useStores from "../../hooks/useStores";
import { BallType } from "../../stores/game/ball";
import { BallCollection as BallCollectionClass } from "../../stores/game/ballCollection";

type BallSelectionProps = {
  setAction: (action: ActionType) => void;
  moveBack: () => void;
  onBallSelection?: () => void;
};

const BallSelection = ({
  setAction,
  moveBack,
  onBallSelection,
}: BallSelectionProps) => {
  const stores = useStores();
  const ballCollectionRefs: {
    [key in BallType]: React.RefObject<HTMLInputElement>;
  } = {
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
            onClick={() => {
              moveBack();
              stores.input.ballCollectionForModifying = undefined;
            }}
          >
            Cancel
          </button>
          <button
            className={
              styles[
                "controller__body--ball_selection__content__button_list__button"
              ]
            }
            onClick={() => {
              const ballCollection: { [key in BallType]: number } = {
                masterball: 0,
                pokeball: 0,
                greatball: 0,
                ultraball: 0,
                healball: 0,
                quickball: 0,
              };
              for (const key in ballCollectionRefs) {
                const curTarget = ballCollectionRefs[key as BallType].current;
                if (curTarget === null) {
                  return;
                }
                ballCollection[key as BallType] = Number(curTarget.value);
              }
              stores.input.ballCollectionForModifying = new BallCollectionClass(
                ballCollection
              );
              onBallSelection && onBallSelection();

              if (
                ballCollectionRefs["masterball"].current &&
                Number(ballCollectionRefs["masterball"].current.value) === 0
              ) {
                setAction("Evolution");
              } else {
                setAction("Reservation");
              }
            }}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default BallSelection;
