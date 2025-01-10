import styles from "./OnlineLobby.module.scss";
import { useNavigate, useSearchParams } from "react-router";
import Frame from "../../components/Frame";
import useStores from "../../hooks/useStores";
import { CharacterTypes } from "../../stores/game/character";
import {
  createRemoteGameRoom,
  isRemoteGameRoomExist,
  joinRemoteGameRoom,
  WebRTCModerators,
} from "../../stores/game/moderator";
import Character from "../../components/chracter";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { uuidToHexColor } from "../../utils";
import Game from "../../stores/game";

const OnlineLobby = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    (async () => {
      const peerId = searchParams.get("room");
      if (!!!peerId) {
        return;
      }

      const isExist = await isRemoteGameRoomExist(peerId);

      if (isExist) {
        const { moderators } = await joinRemoteGameRoom(peerId);
        stores.onlineModerators.set(moderators.moderators);
      } else {
        const { moderators } = await createRemoteGameRoom(peerId);
        stores.onlineModerators.set(moderators.moderators);
      }
    })();
  });

  const moderators = stores.onlineModerators as WebRTCModerators;
  const moderator = moderators.isExist() ? moderators.get(0) : undefined;
  if (moderator?.game) {
    const peerId = searchParams.get("room");
    navigate(`/online?room=${peerId}`);
  }

  return (
    <Frame debug={true}>
      <div className={styles["online_lobby"]}>
        <div className={styles["online_lobby__info"]}>
          <div>방 주소: {searchParams.get("room")}</div>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                `${window.location.origin}/lobby?room=${searchParams.get(
                  "room"
                )}`
              )
            }
          >
            주소 복사하기
          </button>
        </div>
        <form
          className={styles["online_lobby__character_form"]}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {CharacterTypes.map((character, idx) => {
            const playerIdx = idx as 0 | 1 | 2 | 3;
            return (
              <button
                className={
                  styles["online_lobby__character_form__button--selected"]
                }
                key={character}
                // disabled={
                //   moderator !== undefined &&
                //   moderator.peerMap[playerIdx] !== null
                // }
                style={{
                  border:
                    moderator !== undefined &&
                    moderator.peerMap[playerIdx] !== null
                      ? `1px solid ${uuidToHexColor(
                          moderator.peerMap[playerIdx] as string
                        )}`
                      : undefined,
                }}
                onClick={() => {
                  if (!!!moderator) {
                    return;
                  }
                  moderator.publish({
                    type: "SetMyPlayerIdx",
                    data: { playerIdx: playerIdx },
                  });
                }}
              >
                <Character type={character} />
              </button>
            );
          })}
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (moderators.moderators.length !== 2) {
              return;
            }
            const centralModerator = moderators.get(1);
            if (!!!centralModerator) return;
            const playerNum = Object.values(centralModerator.peerMap).reduce(
              (acc, value) => (value !== null ? acc + 1 : acc),
              0
            );
            if (playerNum !== 2 && playerNum !== 3 && playerNum !== 4) {
              return;
            }
            centralModerator.game = new Game();
            centralModerator.game.init(playerNum);
            centralModerator.publish({
              type: "UpdateGameResult",
              data: {
                game: centralModerator.game,
              },
            });
          }}
        >
          <div>
            Current Players:{" "}
            {moderator === undefined
              ? 0
              : Object.values(moderator.peerMap).reduce(
                  (acc, value) => (value !== null ? acc + 1 : acc),
                  0
                )}
          </div>
          {moderators.moderators.length === 2 && (
            <button type="submit">Start</button>
          )}
        </form>
      </div>
    </Frame>
  );
};

export default observer(OnlineLobby);
