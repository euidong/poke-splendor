import "./play.scss";

import BoardStat, {
  ballCollectionObjectToBoardStatProps,
} from "../../components/boardStat";
import Board from "../../components/board";
import PlayerStat from "../../components/playerStat";
import Controller from "../../components/controller";
import useStores from "../../hooks/useStores";
import Game from "../../stores/game";

const Play = () => {
  const stores = useStores();
  const game: Game = stores.game;

  return (
    <div>
      {game.boardBallCollection && (
        <BoardStat
          {...ballCollectionObjectToBoardStatProps(game.boardBallCollection)}
        />
      )}
      {game.boardCards && <Board boardCards={game.boardCards} />}
      {game.players.map((player) => (
        <PlayerStat
          characterName={player.character}
          capturedCards={player.capturedCards}
          reservedCards={player.resevedCards}
          evolutionCnt={player.getEvolutionCnt()}
          score={player.getScore()}
          {...ballCollectionObjectToBoardStatProps(player.ballCollection)}
        />
      ))}
      <Controller />
    </div>
  );
};

export default Play;
