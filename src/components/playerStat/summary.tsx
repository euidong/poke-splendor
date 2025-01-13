import styles from "./PlayerStat.module.scss";
import { ICard } from "../../stores/game/card";
import { BallCollectionProps } from "../ballCollection";
import Character from "../chracter";
import { CharacterType } from "../../stores/game/character";

import { observer } from "mobx-react";

type PlayerStatProps =
  | {
      isMe: boolean;
      characterName: CharacterType;
      capturedCards: ICard[];
      reservedCards: ICard[];
      evolutionCnt: number;
      score: number;
      onClick?: () => void;
      selected: boolean;
    } & BallCollectionProps;

const PlayerStatSummary = (props: PlayerStatProps) => {
  return (
    <div
      className={styles["player_stat--summary"]}
      style={{ outline: props.selected ? "1px solid red" : undefined }}
      onClick={() => props.onClick && props.onClick()}
    >
      <div className={styles["player_stat__profile"]}>
        <Character type={props.characterName} />
      </div>
    </div>
  );
};

export default observer(PlayerStatSummary);
