import styles from "./Main.module.scss";
import { useState } from "react";
import useStores from "../../hooks/useStores";
import Frame from "../../components/Frame";
import { startLocalGame } from "../../stores/game/moderator";

const initialNumPlayers = 4;

const Main = () => {
  const stores = useStores();

  const [numPlayers, setNumPlayers] = useState<2 | 3 | 4>(initialNumPlayers);
  return (
    <Frame debug={true}>
      <div className={styles["main"]}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const { lms } = startLocalGame(numPlayers);
            stores.moderators = lms;
            stores.view.set(stores.view.name === "main" ? "play" : "main");
          }}
          className={styles["main__form"]}
        >
          <div className={styles["main__form__input_wrapper"]}>
            <div className={styles["main__form__input_wrapper__title"]}>
              Number of players:
            </div>
            <input
              className={styles["main__form__input_wrapper__input"]}
              type="number"
              min={2}
              max={4}
              defaultValue={initialNumPlayers}
              onChange={(e) => {
                const value = Number(e.currentTarget.value);
                if (value === 2 || value === 3 || value === 4) {
                  setNumPlayers(value);
                }
              }}
            />
          </div>
          <button
            className={styles["main__form__submit"]}
            disabled={!(numPlayers > 1 && numPlayers < 5)}
            type="submit"
          >
            Play
          </button>
        </form>
      </div>
    </Frame>
  );
};

export default Main;
