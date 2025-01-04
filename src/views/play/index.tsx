import styles from "./Play.module.scss";

import BallCollection, {
  ballCollectionObjectToBallCollectionProps,
} from "../../components/ballCollection";
import Board from "../../components/board";
import PlayerStat from "../../components/playerStat";
import Controller from "../../components/controller";
import useStores from "../../hooks/useStores";
import Frame from "../../components/Frame";
import { IModerator } from "../../stores/game/moderator";

type PlayProps = {
  playerIdx: number;
};

const Play = ({ playerIdx }: PlayProps) => {
  const stores = useStores();
  const moderator: IModerator = stores.moderators[playerIdx];
  const game = moderator.game;

  return game.turn === moderator.myPlayerIdx ? (
    <Frame debug={true}>
      <div className={styles["play"]}>
        {game.boardBallCollection && (
          <BallCollection
            {...ballCollectionObjectToBallCollectionProps(
              game.boardBallCollection
            )}
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
            {...ballCollectionObjectToBallCollectionProps(
              player.ballCollection
            )}
          />
        ))}
      </div>
      <Controller />
    </Frame>
  ) : (
    <></>
  );
};

export default Play;
