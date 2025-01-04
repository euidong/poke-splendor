import { ActionType } from ".";
import styles from "./Controller.module.scss";

type ReservationProps = {
  moveBack: () => void;
  setAction: (action: ActionType) => void;
};

const Reservation = ({ moveBack, setAction }: ReservationProps) => {
  return (
    <>
      <div className={styles["controller__body--reservation__title"]}>
        Reservation
      </div>
      <div></div>
      <div className={styles["controller__body--reservation__content"]}>
        <div
          className={
            styles["controller__body--reservation__content__button_list"]
          }
        >
          <button
            className={
              styles[
                "controller__body--reservation__content__button_list__button"
              ]
            }
            onClick={() => moveBack()}
          >
            Cancel
          </button>
          <button
            className={
              styles[
                "controller__body--reservation__content__button_list__button"
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

export default Reservation;
