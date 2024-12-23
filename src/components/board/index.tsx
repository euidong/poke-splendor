import useStores from "../../hooks/useStores";
import { BoardCard } from "../../stores/game/card";

const Board = () => {
  const { game } = useStores();
  return (
    <div>
      <div>[Board]</div>
      {game.boardCards.map((card: BoardCard) => {
        if (card.type === "Tier1" && card.open) {
          return (
            <div>
              {card.type} {card.pokemon.name}
            </div>
          );
        }
        return null;
      })}
      {game.boardCards.map((card: BoardCard) => {
        if (card.type === "Tier2" && card.open) {
          return (
            <div>
              {card.type} {card.pokemon.name}
            </div>
          );
        }
        return null;
      })}
      {game.boardCards.map((card: BoardCard) => {
        if (card.type === "Tier3" && card.open) {
          return (
            <div>
              {card.type} {card.pokemon.name}
            </div>
          );
        }
        return null;
      })}
      {game.boardCards.map((card: BoardCard) => {
        if (card.type === "Rare" && card.open) {
          return (
            <div>
              {card.type} {card.pokemon.name}
            </div>
          );
        }
        return null;
      })}
      {game.boardCards.map((card: BoardCard) => {
        if (card.type === "Legendary" && card.open) {
          return (
            <div>
              {card.type} {card.pokemon.name}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Board;
