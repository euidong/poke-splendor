import styles from "./Controller.module.scss";
import { ActionType } from ".";

type ActionSelectionProps = {
  setAction: (action: ActionType) => void;
};

const ActionSelection = ({ setAction }: ActionSelectionProps) => {
  return (
    <>
      <button
        className={styles["controller__body--action_selection__button"]}
        onClick={() => setAction("Capturing")}
      >
        Capturing
      </button>
      <button
        className={styles["controller__body--action_selection__button"]}
        onClick={() => setAction("BallSelection")}
      >
        Ball Selection
      </button>
    </>
  );
};

export default ActionSelection;
