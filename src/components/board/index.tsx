import styles from "./Board.module.scss";
import { BoardCard } from "../../stores/game/card";
import Card, { cardObjectToCardProps } from "../card";
import useStores from "../../hooks/useStores";
import { observer } from "mobx-react";

type BoardProps = {
  boardCards: BoardCard[];
};

const Board = ({ boardCards }: BoardProps) => {
  const stores = useStores();
  const isSelectionMode = stores.controller.isBoardInSelectionMode;

  return (
    <div className={styles["board"]}>
      <div className={styles["board__card_list"]}>
        {boardCards.map((card: BoardCard) => {
          if (
            (card.type === "Legendary" || card.type === "Rare") &&
            card.open
          ) {
            return (
              <Card
                key={card.id}
                {...cardObjectToCardProps(card, "Front")}
                isSelected={stores.controller.selectedTgtPokeCardId === card.id}
                view={
                  stores.controller.selectedTgtPokeCardId === card.id
                    ? "Full"
                    : "Summary"
                }
                onClick={
                  isSelectionMode
                    ? () =>
                        (stores.controller.selectedTgtPokeCardId =
                          stores.controller.selectedTgtPokeCardId === card.id
                            ? null
                            : card.id)
                    : undefined
                }
              />
            );
          }
          return null;
        })}
      </div>
      {["Tier3", "Tier2", "Tier1"].map((cardType) => {
        return (
          <div key={cardType} className={styles["board__card_list"]}>
            {boardCards.map((card: BoardCard) => {
              if (card.type === cardType && card.open) {
                return (
                  <Card
                    key={card.id}
                    {...cardObjectToCardProps(card, "Front")}
                    isSelected={
                      stores.controller.selectedTgtPokeCardId === card.id
                    }
                    view={
                      stores.controller.selectedTgtPokeCardId === card.id
                        ? "Full"
                        : "Summary"
                    }
                    onClick={
                      isSelectionMode
                        ? () =>
                            (stores.controller.selectedTgtPokeCardId =
                              stores.controller.selectedTgtPokeCardId ===
                              card.id
                                ? null
                                : card.id)
                        : undefined
                    }
                  />
                );
              }
              return null;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default observer(Board);
