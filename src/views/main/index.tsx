import { useState } from "react";
import useStores from "../../hooks/useStores";
import "./main.scss";

const Main = () => {
  const { view, game } = useStores();

  const [numPlayers, setNumPlayers] = useState(0);
  return (
    <div>
      {view.name}
      <div>
        플레이어 수:
        <input
          type="number"
          onChange={(e) => setNumPlayers(Number(e.currentTarget.value))}
        />
      </div>

      <button
        disabled={!(numPlayers > 1 && numPlayers < 5)}
        onClick={() => {
          view.set(view.name === "main" ? "play" : "main");
          game.init(numPlayers);
          console.log(view.name);
        }}
      >
        Play
      </button>
    </div>
  );
};

export default Main;
