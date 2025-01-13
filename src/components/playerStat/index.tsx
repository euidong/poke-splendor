import styles from "./PlayerStat.module.scss";
import { ICard } from "../../stores/game/card";
import BallCollection, { BallCollectionProps } from "../ballCollection";
import Character from "../chracter";
import { CharacterType } from "../../stores/game/character";
import Card, { cardObjectToCardProps } from "../card";
import useStores from "../../hooks/useStores";
import { observer } from "mobx-react";

type PlayerStatProps =
  | {
      isMe: boolean;
      characterName: CharacterType;
      capturedCards: ICard[];
      reservedCards: ICard[];
      evolutionCnt: number;
      score: number;
    } & BallCollectionProps;

const PlayerStat = ({
  isMe,
  characterName,
  capturedCards,
  reservedCards,
  evolutionCnt,
  score,
  ...balls
}: PlayerStatProps) => {
  const stores = useStores();
  const isTgtSelectionMode = stores.controller.isPlayerStatTgtInSelectionMode;
  const isSrcSelectionMode = stores.controller.isPlayerStatSrcInSelectionMode;

  const capturedCardGroup: ICard[][] = [];
  capturedCards.forEach((card, idx) => {
    if (idx % 4 === 0) {
      capturedCardGroup.push([]);
    }
    capturedCardGroup[Math.floor(idx / 4)].push(card);
  });
  const reservedCardGroup: ICard[][] = [];
  reservedCards.forEach((card, idx) => {
    if (idx % 4 === 0) {
      reservedCardGroup.push([]);
    }
    reservedCardGroup[Math.floor(idx / 4)].push(card);
  });
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
      <div className={styles["player_stat__list_title"]}>Captured Cards</div>
      {capturedCardGroup.map((group) => (
        <div className={styles["player_stat__card_list"]}>
          {group.map((card) => (
            <Card
              {...cardObjectToCardProps(card, "Front")}
              isSelected={stores.controller.selectedSrcPokeCardId === card.id}
              onClick={
                isMe && isSrcSelectionMode
                  ? () =>
                      (stores.controller.selectedSrcPokeCardId =
                        stores.controller.selectedSrcPokeCardId === card.id
                          ? null
                          : card.id)
                  : undefined
              }
            />
          ))}
        </div>
      ))}
      {capturedCards.length === 0 && (
        <div className={styles["player_stat__card_empty"]}>Empty</div>
      )}

      <div className={styles["player_stat__list_title"]}>Reserved Cards</div>
      {reservedCardGroup.map((group) => (
        <div className={styles["player_stat__card_list"]}>
          {group.map((card) => (
            <Card
              {...cardObjectToCardProps(card, "Front")}
              isSelected={stores.controller.selectedTgtPokeCardId === card.id}
              onClick={
                isMe && isTgtSelectionMode
                  ? () =>
                      (stores.controller.selectedTgtPokeCardId =
                        stores.controller.selectedTgtPokeCardId === card.id
                          ? null
                          : card.id)
                  : undefined
              }
            />
          ))}
        </div>
      ))}
      {reservedCards.length === 0 && (
        <div className={styles["player_stat__card_empty"]}>Empty</div>
      )}
    </div>
  );
};

export default observer(PlayerStat);
