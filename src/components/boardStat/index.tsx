import useStores from "../../hooks/useStores";
import Game from "../../stores/game";

const BoardStat = () => {
  const stores = useStores();
  const game: Game = stores.game;

  return (
    <div>
      [BoardState] # Player: {game.numPlayers} | masterball:{" "}
      {game.boardBallCollection?.balls.masterball} | ultraball:{" "}
      {game.boardBallCollection?.balls.ultraball} | quickball:{" "}
      {game.boardBallCollection?.balls.quickball} | healball:{" "}
      {game.boardBallCollection?.balls.healball} | greatball:{" "}
      {game.boardBallCollection?.balls.greatball} | pokeball:{" "}
      {game.boardBallCollection?.balls.pokeball}
    </div>
  );
};

export default BoardStat;
