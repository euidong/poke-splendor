import styles from "./Home.module.scss";
import { useState } from "react";
import Frame from "../../components/Frame";
import { useNavigate } from "react-router";
import { observer } from "mobx-react";

const initialNumPlayers = 4;

const Home = () => {
  const placeholder = crypto.randomUUID();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"Local" | "Online" | undefined>();
  const [numPlayers, setNumPlayers] = useState<number>(initialNumPlayers);

  return (
    <Frame debug={true}>
      <div className={styles["home"]}>
        {!!!mode && (
          <div className={styles["home__wrapper"]}>
            <button
              className={styles["home__wrapper__button"]}
              type="submit"
              onClick={() => setMode("Local")}
            >
              Local
            </button>
            <button
              className={styles["home__wrapper__button"]}
              type="submit"
              onClick={() => setMode("Online")}
            >
              OnLine
            </button>
          </div>
        )}
        {mode === "Local" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`${process.env.PUBLIC_URL}/local?players=${numPlayers}`);
            }}
            className={styles["home__wrapper"]}
          >
            <div className={styles["home__wrapper__input_wrapper"]}>
              <div className={styles["home__wrapper__input_wrapper__title"]}>
                Number of players:
              </div>
              <input
                className={styles["home__wrapper__input_wrapper__input"]}
                type="number"
                min={2}
                max={4}
                defaultValue={initialNumPlayers}
                onChange={(e) => {
                  const value = Number(e.currentTarget.value);
                  setNumPlayers(value);
                }}
              />
            </div>
            <button
              className={styles["home__wrapper__button"]}
              disabled={!(numPlayers > 1 && numPlayers < 5)}
              type="submit"
            >
              Play
            </button>
            <button
              className={styles["home__wrapper__button"]}
              disabled={!(numPlayers > 1 && numPlayers < 5)}
              type="button"
              onClick={() => setMode(undefined)}
            >
              Cancel
            </button>
          </form>
        )}
        {mode === "Online" && (
          <div className={styles["home__wrapper"]}>
            <form
              className={styles["home__wrapper__join"]}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const address = formData.get("address");
                if (!!!address) {
                  navigate(
                    `${process.env.PUBLIC_URL}/lobby?room=${placeholder}`
                  );
                } else {
                  navigate(`${process.env.PUBLIC_URL}/lobby?room=${address}`);
                }
              }}
            >
              <div className={styles["home__wrapper__join__description"]}>
                Before you start please check your internet
              </div>
              <input
                className={styles["home__wrapper__join__address"]}
                placeholder={placeholder}
                name="address"
              />
              <button
                className={styles["home__wrapper__join__button"]}
                type="submit"
              >
                Join Room
              </button>
            </form>
            <button
              className={styles["home__wrapper__button"]}
              type="button"
              onClick={() => {
                const address = crypto.randomUUID();
                navigate(`${process.env.PUBLIC_URL}/lobby?room=${address}`);
              }}
            >
              Create Room
            </button>
            <button
              className={styles["home__wrapper__button"]}
              type="button"
              onClick={() => setMode(undefined)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </Frame>
  );
};

export default observer(Home);
