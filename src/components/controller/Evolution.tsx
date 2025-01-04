import styles from "./Controller.module.scss";

type EvolutionProps = {
  reset: () => void;
  moveBack: () => void;
  onFinish?: () => void;
};

const Evolution = ({ reset, moveBack, onFinish }: EvolutionProps) => {
  return (
    <>
      <div className={styles["controller__body--evolution__title"]}>
        Evolution
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
            onClick={() => moveBack()}
          >
            Cancel
          </button>
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
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default Evolution;
