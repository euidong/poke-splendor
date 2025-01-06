import { useEffect } from "react";
import { ActionType } from ".";
import useStores from "../../hooks/useStores";
import styles from "./Controller.module.scss";
import { observer } from "mobx-react";

type ReservationProps = {
  setAction: (action: ActionType) => void;
  onReservation?: () => void;
};

const Reservation = ({ setAction, onReservation }: ReservationProps) => {
  const stores = useStores();
  useEffect(() => {
    stores.input.selectedTgtPokeCardNo = null;
    stores.controller.isBoardInSelectionMode = true;
    return () => {
      stores.controller.isBoardInSelectionMode = false;
      stores.input.selectedTgtPokeCardNo = null;
    }; // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className={styles["controller__body--reservation__title"]}>
        Reservation
      </div>
      <div className={styles["controller__body--reservation__description"]}>
        You can choose a Pokémon card from the board that you want to reserve
        only for you.
      </div>
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
            onClick={() => setAction("Evolution")}
          >
            No
          </button>
          <button
            className={
              styles[
                "controller__body--reservation__content__button_list__button"
              ]
            }
            disabled={stores.input.selectedTgtPokeCardNo === null}
            onClick={() => {
              stores.input.targetReservePokeCardId =
                stores.input.selectedTgtPokeCardNo;
              stores.input.selectedTgtPokeCardNo = null;
              onReservation && onReservation();
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

export default observer(Reservation);
