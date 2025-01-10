import { useEffect } from "react";
import { WebRTCModerator } from "../../stores/game/moderator";
import Game from "../../stores/game";
import { emptyBallCollection } from "../../stores/const";
import { BallCollection } from "../../stores/game/ballCollection";

const WebRtcTest = () => {
  useEffect(() => {
    (async () => {
      const game = new Game();
      game.init(4);
      const centralModeratorId = crypto.randomUUID();
      const guestModeratorIds = [
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ];
      const centralModerator = new WebRTCModerator(
        centralModeratorId,
        centralModeratorId
      );

      const guestModerators = guestModeratorIds.map((id, idx) => {
        const guestModerator = new WebRTCModerator(id, centralModeratorId);
        guestModerator.myPlayerIdx = idx;
        return guestModerator;
      });

      await centralModerator.subscribe();
      await Promise.all(guestModerators.map((m) => m.subscribe()));

      await guestModerators[0].publish({
        type: "ModifyBallCollection",
        data: {
          ballCollection: new BallCollection({
            ...emptyBallCollection.balls,
            masterball: 1,
          }),
        },
      });
    })();
  }, []);

  return <></>;
};

export default WebRtcTest;
