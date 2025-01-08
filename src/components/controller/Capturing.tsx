import styles from "./Controller.module.scss";
import { ActionType } from ".";
import { createRef, useEffect } from "react";
import useStores from "../../hooks/useStores";
import { observer } from "mobx-react";
import BallCollection from "../ballCollection";
import { BallType } from "../../stores/game/ball";
import { BallCollection as BallCollectionClass } from "../../stores/game/ballCollection";

type CapturingProps = {
  setAction: (action: ActionType) => void;
  moveBack: () => void;
  onCapture?: () => void;
};

const Capturing = ({ setAction, moveBack, onCapture }: CapturingProps) => {
  const stores = useStores();
  useEffect(() => {
    stores.controller.selectedTgtPokeCardId = null;
    stores.controller.isBoardInSelectionMode = true;
    stores.controller.isPlayerStatTgtInSelectionMode = true;
    return () => {
      stores.controller.isBoardInSelectionMode = false;
      stores.controller.isPlayerStatTgtInSelectionMode = false;
      stores.controller.selectedTgtPokeCardId = null;
    }; // eslint-disable-next-line
  }, []);

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
      <div className={styles["controller__body--capturing__title"]}>
        Capturing
      </div>
      <div className={styles["controller__body--capturing__description"]}>
        {stores.controller.selectedTgtPokeCardId
          ? "Now, you must decide which ball to capture that Pokémon."
          : "You can choose a Pokémon card from the board and the your hands that satisfies the number of balls you have."}
      </div>
      <div className={styles["controller__body--capturing__content"]}>
        {stores.controller.selectedTgtPokeCardId && (
          <div
            className={
              styles["controller__body--capturing__content__ball_list"]
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
        )}

        <div
          className={
            styles["controller__body--capturing__content__button_list"]
          }
        >
          <button
            className={
              styles[
                "controller__body--capturing__content__button_list__button"
              ]
            }
            onClick={() => moveBack()}
          >
            Cancel
          </button>
          <button
            className={
              styles[
                "controller__body--capturing__content__button_list__button"
              ]
            }
            disabled={!!!stores.controller.selectedTgtPokeCardId}
            onClick={() => {
              stores.input.targetCapturePokeCardId =
                stores.controller.selectedTgtPokeCardId;
              stores.controller.selectedTgtPokeCardId = null;
              const ballCollection: { [key in BallType]: number } = {
                masterball: Number(
                  ballCollectionRefs.masterball.current?.value || 0
                ),
                pokeball: Number(
                  ballCollectionRefs.pokeball.current?.value || 0
                ),
                greatball: Number(
                  ballCollectionRefs.greatball.current?.value || 0
                ),
                ultraball: Number(
                  ballCollectionRefs.ultraball.current?.value || 0
                ),
                healball: Number(
                  ballCollectionRefs.healball.current?.value || 0
                ),
                quickball: Number(
                  ballCollectionRefs.quickball.current?.value || 0
                ),
              };
              stores.input.ballCollectionForCapturing = new BallCollectionClass(
                ballCollection
              );

              onCapture && onCapture();
              setAction("Evolution");
            }}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default observer(Capturing);
