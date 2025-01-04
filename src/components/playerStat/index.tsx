import styles from "./PlayerStat.module.scss";
import { ICard } from "../../stores/game/card";
import BallCollection, { BallCollectionProps } from "../ballCollection";
import Character from "../../chracter";
import { CharacterType } from "../../stores/game/character";
import Card, { cardObjectToCardProps } from "../card";

type PlayerStatProps =
  | {
      characterName: CharacterType;
      capturedCards: ICard[];
      reservedCards: ICard[];
      evolutionCnt: number;
      score: number;
    } & BallCollectionProps;

const PlayerStat = ({
  characterName,
  capturedCards,
  reservedCards,
  evolutionCnt,
  score,
  ...balls
}: PlayerStatProps) => {
  return (
    <div className={styles["player_stat"]}>
      <div className={styles["player_stat__profile"]}>
        <div className={styles["player_stat__profile__character_wrapper"]}>
          <Character type={characterName} />
        </div>
        <div className={styles["player_stat__profile__evolution"]}>
          Evolution: {evolutionCnt}
        </div>
        <div className={styles["player_stat__profile__score"]}>
          Score: {score}
        </div>
        <div className={styles["player_stat__profile__card"]}>
          Card: {capturedCards.length}
        </div>
      </div>
      <div className={styles["player_stat__ball_list"]}>
        <BallCollection {...balls} />
      </div>
      {capturedCards.length > 0 && (
        <div className={styles["player_stat__card_list"]}>
          {capturedCards.map((card) => (
            <Card {...cardObjectToCardProps(card, "Front")} />
          ))}
        </div>
      )}
      {reservedCards.length > 0 && (
        <div className={styles["player_stat__card_list"]}>
          {reservedCards.map((card) => (
            <Card {...cardObjectToCardProps(card, "Front")} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerStat;
