import { useEffect } from "react";
import useStores from "../../hooks/useStores";
import styles from "./Controller.module.scss";

type EvolutionProps = {
  reset: () => void;
  onFinish?: () => void;
  onEvolution?: () => void;
};

const Evolution = ({ reset, onFinish, onEvolution }: EvolutionProps) => {
  const stores = useStores();
  useEffect(() => {
    stores.controller.selectedTgtPokeCardId = null;
    stores.controller.isBoardInSelectionMode = true;
    stores.controller.isPlayerStatTgtInSelectionMode = true;
    stores.controller.isPlayerStatSrcInSelectionMode = true;
    return () => {
      stores.controller.isBoardInSelectionMode = false;
      stores.controller.isPlayerStatTgtInSelectionMode = false;
      stores.controller.isPlayerStatSrcInSelectionMode = true;
      stores.controller.selectedTgtPokeCardId = null;
    }; // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className={styles["controller__body--evolution__title"]}>
        Evolution
      </div>
      <div className={styles["controller__body--evolution__description"]}>
        You can choose a Pokémon card from the board and the your hands that
        satisfies the number of balls your cards have.
      </div>
      <div className={styles["controller__body--evolution__content"]}>
        <div
          className={
            styles["controller__body--evolution__content__button_list"]
          }
        >
          <button
            className={
              styles[
                "controller__body--evolution__content__button_list__button"
              ]
            }
            onClick={() => {
              onFinish && onFinish();
              reset();
            }}
          >
            No
          </button>
          <button
            className={
              styles[
                "controller__body--evolution__content__button_list__button"
              ]
            }
            onClick={() => {
              stores.input.targetEvolvePokeCardId =
                stores.controller.selectedTgtPokeCardId;
              stores.input.sourceEvolvePokeCardId =
                stores.controller.selectedSrcPokeCardId;
              stores.controller.selectedTgtPokeCardId = null;
              stores.controller.selectedSrcPokeCardId = null;
              onEvolution && onEvolution();
              onFinish && onFinish();
              reset();
            }}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default Evolution;
