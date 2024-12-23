import useStores from "../../hooks/useStores";
import Game from "../../stores/game";

const BoardStat = () => {
  const stores = useStores();
  const game: Game = stores.game;

  return (
    <div>
      [BoardState] # Player: {game.numPlayers} | 마스터볼:{" "}
      {game.boardBallCollection?.balls.masterBall} | 하이퍼볼:{" "}
      {game.boardBallCollection?.balls.ultraBall} | 퀵볼:{" "}
      {game.boardBallCollection?.balls.quickBall} | 힐볼:{" "}
      {game.boardBallCollection?.balls.healBall} | 슈퍼볼:{" "}
      {game.boardBallCollection?.balls.greatBall} | 몬스터볼:{" "}
      {game.boardBallCollection?.balls.pokeBall}
    </div>
  );
};

export default BoardStat;
