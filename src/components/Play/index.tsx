import styles from "./Play.module.scss";

import BallCollection, {
  ballCollectionObjectToBallCollectionProps,
} from "../ballCollection";
import Board from "../board";
import PlayerStatSummary from "../playerStat/summary";
import Controller from "../controller";
import useStores from "../../hooks/useStores";
import Frame from "../Frame";
import { IModerator, PublishInput } from "../../stores/game/moderator";
import { observer } from "mobx-react";
import WinnerModal from "../WinnerModal";
import { useNavigate } from "react-router";
import { CharacterTypes } from "../../stores/game/character";
import Timer from "../Timer";
import PlayerStat from "../playerStat";
import { useState } from "react";

type PlayProps = {
  playerIdx: number;
  moderator: IModerator;
  hide?: boolean;
};

const Play = ({ playerIdx, moderator, hide }: PlayProps) => {
  const stores = useStores();
  const navigate = useNavigate();
  const game = moderator.game;
  const [openedPlayerIdx, setOpenedPlayerIdx] = useState<number | undefined>(
    playerIdx
  );

  if (!!!game) return <></>; // TODO: fix it
  if (hide && game.turn !== playerIdx) {
    return <></>;
  }
  const maxScore = Math.max(...game.players.map((p) => p.getScore()));

  return (
    <Frame debug={true}>
      <div className={styles["play"]}>
        <header className={styles["play__header"]}>
          <span className={styles["play__header__info"]}>
            Round#{game.round} - {CharacterTypes[game.turn!]}'s turn
          </span>
          <Timer
            initialSeconds={90}
            onTimeout={() => {
              stores.input.clear();
              moderator.publish({ type: "FinishTurn", data: {} });
            }}
          />
        </header>
        <div className={styles["play__body"]}>
          {game.boardBallCollection && (
            <BallCollection
              {...ballCollectionObjectToBallCollectionProps(
                game.boardBallCollection
              )}
            />
          )}
          {game.boardCards && <Board boardCards={game.boardCards} />}
          <div className={styles["play__body__player_list"]}>
            {game.players.map((player, idx) => (
              <PlayerStatSummary
                key={player.character}
                isMe={playerIdx === idx}
                characterName={player.character}
                capturedCards={player.capturedCards}
                reservedCards={player.resevedCards}
                evolutionCnt={player.getEvolutionCnt()}
                score={player.getScore()}
                selected={openedPlayerIdx === idx}
                onClick={() => {
                  setOpenedPlayerIdx((curIdx) =>
                    curIdx === idx ? undefined : idx
                  );
                }}
                {...ballCollectionObjectToBallCollectionProps(
                  player.ballCollection
                )}
              />
            ))}
          </div>
          {openedPlayerIdx !== undefined && (
            <PlayerStat
              key={game.players[openedPlayerIdx].character}
              isMe={openedPlayerIdx === game.turn}
              characterName={game.players[openedPlayerIdx].character}
              capturedCards={game.players[openedPlayerIdx].capturedCards}
              reservedCards={game.players[openedPlayerIdx].resevedCards}
              evolutionCnt={game.players[openedPlayerIdx].getEvolutionCnt()}
              score={game.players[openedPlayerIdx].getScore()}
              {...ballCollectionObjectToBallCollectionProps(
                game.players[openedPlayerIdx].ballCollection
              )}
            />
          )}
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
              stores.input.clear();
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
              stores.input.clear();
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
              stores.input.clear();
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
              stores.input.clear();
            }
          }}
          onFinish={() => {
            const fpi: PublishInput<"FinishTurn"> = {
              type: "FinishTurn",
              data: {},
            };
            moderator.publish(fpi);
            stores.input.clear();
          }}
        />
      </div>

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
