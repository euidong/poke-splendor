import styles from "./Main.module.scss";
import { useState } from "react";
import useStores from "../../hooks/useStores";
import Frame from "../../components/Frame";
import { startLocalGame } from "../../stores/game/moderator";

const initialNumPlayers = 4;

const Main = () => {
  const stores = useStores();

  const [numPlayers, setNumPlayers] = useState(initialNumPlayers);
  return (
    <Frame debug={true}>
      <div className={styles["main"]}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const { game, moderators } = startLocalGame(numPlayers);
            stores.moderators = moderators;
            stores.game = game;
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
              onChange={(e) => setNumPlayers(Number(e.currentTarget.value))}
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
