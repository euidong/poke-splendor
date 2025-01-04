import styles from "./Controller.module.scss";
import { ActionType } from ".";

type CapturingProps = {
  setAction: (action: ActionType) => void;
  moveBack: () => void;
};

const Capturing = ({ setAction, moveBack }: CapturingProps) => {
  return (
    <>
      <div className={styles["controller__body--capturing__title"]}>
        Capturing
      </div>
      <div className={styles["controller__body--capturing__description"]}>
        You can choose a Pokémon card from the board that satisfies the number
        of balls you have.
      </div>
      <div className={styles["controller__body--capturing__content"]}>
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
            onClick={() => setAction("Evolution")}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default Capturing;
