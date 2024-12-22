import useStores from "../../hooks/useStores";

const BoardStat = () => {
  const { game } = useStores();
  return (
    <div>
      [BoardState] # Player: {game.numPlayers} | 마스터볼:{" "}
      {game.boardBalls.masterBall} | 하이퍼볼: {game.boardBalls.ultraBall} |
      퀵볼: {game.boardBalls.quickBall} | 힐볼: {game.boardBalls.healBall} |
      슈퍼볼: {game.boardBalls.greatBall} | 몬스터볼: {game.boardBalls.pokeBall}
    </div>
  );
};

export default BoardStat;
