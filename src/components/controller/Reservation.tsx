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
    stores.controller.selectedTgtPokeCardId = null;
    stores.controller.isBoardInSelectionMode = true;
    return () => {
      stores.controller.isBoardInSelectionMode = false;
      stores.controller.selectedTgtPokeCardId = null;
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
            disabled={stores.controller.selectedTgtPokeCardId === null}
            onClick={() => {
              stores.input.targetReservePokeCardId =
                stores.controller.selectedTgtPokeCardId;
              stores.controller.selectedTgtPokeCardId = null;
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
