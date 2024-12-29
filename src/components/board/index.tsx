import styles from "./Board.module.scss";
import { BoardCard } from "../../stores/game/card";
import Card, { cardObjectToCardProps } from "../card";

type BoardProps = {
  boardCards: BoardCard[];
};

const Board = ({ boardCards }: BoardProps) => {
  return (
    <div className={styles["board"]}>
      {["Tier3", "Tier2", "Tier1"].map((cardType) => {
        return (
          <div className={styles["board__card_list"]}>
            {boardCards.map((card: BoardCard) => {
              if (card.type === cardType && card.open) {
                return <Card {...cardObjectToCardProps(card, "Front")} />;
              }
              return null;
            })}
          </div>
        );
      })}
      <div className={styles["board__card_list"]}>
        {boardCards.map((card: BoardCard) => {
          if (
            (card.type === "Legendary" || card.type === "Rare") &&
            card.open
          ) {
            return <Card {...cardObjectToCardProps(card, "Front")} />;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Board;
