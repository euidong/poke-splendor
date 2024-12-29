import useStores from "../../hooks/useStores";
import Game from "../../stores/game";
import Ball from "../ball";
import BoardStat from "../boardStat";

const BallSelection = () => {
  const stores = useStores();
  const game: Game = stores.game;
  return (
    <div>
      <div>Ball Selection</div>
      {game.boardBallCollection && (
        <BoardStat {...game.boardBallCollection.balls} />
      )}
      <div>
        <button>Cancel</button>
        <button>OK</button>
      </div>
    </div>
  );
};

export default BallSelection;
