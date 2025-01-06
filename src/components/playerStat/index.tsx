import styles from "./PlayerStat.module.scss";
import { ICard } from "../../stores/game/card";
import BallCollection, { BallCollectionProps } from "../ballCollection";
import Character from "../../chracter";
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
      {capturedCards.length > 0 ? (
        <div className={styles["player_stat__card_list"]}>
          {capturedCards.map((card) => (
            <Card
              {...cardObjectToCardProps(card, "Front")}
              isSelected={stores.input.selectedSrcPokeCardNo === card.id}
              onClick={
                isMe && isSrcSelectionMode
                  ? () =>
                      (stores.input.selectedSrcPokeCardNo =
                        stores.input.selectedSrcPokeCardNo === card.id
                          ? null
                          : card.id)
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className={styles["player_stat__card_empty"]}>Empty</div>
      )}
      <div className={styles["player_stat__list_title"]}>Reserved Cards</div>
      {reservedCards.length > 0 ? (
        <div className={styles["player_stat__card_list"]}>
          {reservedCards.map((card) => (
            <Card
              {...cardObjectToCardProps(card, "Front")}
              isSelected={stores.input.selectedTgtPokeCardNo === card.id}
              onClick={
                isMe && isTgtSelectionMode
                  ? () =>
                      (stores.input.selectedTgtPokeCardNo =
                        stores.input.selectedTgtPokeCardNo === card.id
                          ? null
                          : card.id)
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className={styles["player_stat__card_empty"]}>Empty</div>
      )}
    </div>
  );
};

export default observer(PlayerStat);
