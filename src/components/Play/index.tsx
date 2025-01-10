import styles from "./Play.module.scss";

import BallCollection, {
  ballCollectionObjectToBallCollectionProps,
} from "../ballCollection";
import Board from "../board";
import PlayerStat from "../playerStat";
import Controller from "../controller";
import useStores from "../../hooks/useStores";
import Frame from "../Frame";
import { IModerator, PublishInput } from "../../stores/game/moderator";
import { observer } from "mobx-react";
import WinnerModal from "../WinnerModal";
import { useNavigate } from "react-router";

type PlayProps = {
  playerIdx: number;
  moderator: IModerator;
  hide?: boolean;
};

const Play = ({ playerIdx, moderator, hide }: PlayProps) => {
  const stores = useStores();
  const navigate = useNavigate();
  const game = moderator.game;

  if (!!!game) return <></>; // TODO: fix it
  if (hide && game.turn !== playerIdx) {
    return <></>;
  }
  const maxScore = Math.max(...game.players.map((p) => p.getScore()));

  return (
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
            key={player.character}
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
          onGotoLobbyClick={() => navigate("/")}
        />
      )}
    </Frame>
  );
};

export default observer(Play);
