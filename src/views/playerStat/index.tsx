import PlayerStatComponent from "../../components/playerStat";
import { cards } from "../../stores/const";

const PlayerStat = () => {
  return (
    <PlayerStatComponent
      isMe={true}
      characterName="Ash"
      capturedCards={[cards[1], cards[2], cards[3], cards[4], cards[5]]}
      reservedCards={[cards[6], cards[7]]}
      evolutionCnt={3}
      score={1}
      masterball={0}
      pokeball={0}
      quickball={0}
      healball={0}
      ultraball={0}
      greatball={0}
    />
  );
};

export default PlayerStat;
