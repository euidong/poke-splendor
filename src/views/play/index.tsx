import styles from "./Play.module.scss";

import BallCollection, {
  ballCollectionObjectToBallCollectionProps,
} from "../../components/ballCollection";
import Board from "../../components/board";
import PlayerStat from "../../components/playerStat";
import Controller from "../../components/controller";
import useStores from "../../hooks/useStores";
import Frame from "../../components/Frame";
import { IModerator, PublishInput } from "../../stores/game/moderator";
import { observer } from "mobx-react";
import WinnerModal from "../../components/WinnerModal";

type PlayProps = {
  playerIdx: number;
};

const Play = ({ playerIdx }: PlayProps) => {
  const stores = useStores();
  const moderator: IModerator = stores.moderators.get(playerIdx);
  const game = moderator.game;
  const maxScore = Math.max(...game.players.map((p) => p.getScore()));

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
        {game.players.map((player, idx) => (
          <PlayerStat
            isMe={playerIdx === idx}
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
      <Controller
        onCapture={() => {
          if (stores.input.targetCapturePokeCardId) {
            const cpi: PublishInput<"CapturePokeCard"> = {
              type: "CapturePokeCard",
              data: {
                cardId: stores.input.targetCapturePokeCardId,
                costBallCollection: stores.input.ballCollectionForCapturing,
              },
            };
            moderator.publish(cpi);
          }
        }}
        onEvolution={() => {
          if (
            stores.input.targetEvolvePokeCardId &&
            stores.input.sourceEvolvePokeCardId
          ) {
            const epi: PublishInput<"EvolvePokeCard"> = {
              type: "EvolvePokeCard",
              data: {
                srcCardId: stores.input.sourceEvolvePokeCardId,
                tgtCardId: stores.input.targetEvolvePokeCardId,
              },
            };
            debugger;
            moderator.publish(epi);
          }
        }}
        onReservation={() => {
          if (stores.input.targetReservePokeCardId) {
            const rpi: PublishInput<"ReservePokeCard"> = {
              type: "ReservePokeCard",
              data: {
                cardId: stores.input.targetReservePokeCardId,
              },
            };
            moderator.publish(rpi);
          }
        }}
        onBallSelection={() => {
          if (stores.input.ballCollectionForModifying) {
            const bpi: PublishInput<"ModifyBallCollection"> = {
              type: "ModifyBallCollection",
              data: {
                ballCollection: stores.input.ballCollectionForModifying,
              },
            };
            moderator.publish(bpi);
          }
        }}
        onFinish={() => {
          stores.input.clear();
          const fpi: PublishInput<"FinishTurn"> = {
            type: "FinishTurn",
            data: {},
          };
          moderator.publish(fpi);
        }}
      />

      {game.isDone() && (
        <WinnerModal
          winner={game.players
            .filter((p) => p.getScore() === maxScore)
            .map((p) => p.character)
            .join(", ")}
          onGotoLobbyClick={() => (stores.view.name = "main")}
        />
      )}
    </Frame>
  ) : (
    <></>
  );
};

export default observer(Play);
