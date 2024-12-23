import useStores from "../../hooks/useStores";
import { BoardCard } from "../../stores/game/card";

const Board = () => {
  const { game } = useStores();
  return (
    <div>
      <div>[Board]</div>
      {game.boardCards.map((card: BoardCard) => {
        if (card.type === "1단계" && card.open) {
          return (
            <div>
              {card.type} {card.pokemon.name}
            </div>
          );
        }
        return null;
      })}
      {game.boardCards.map((card: BoardCard) => {
        if (card.type === "2단계" && card.open) {
          return (
            <div>
              {card.type} {card.pokemon.name}
            </div>
          );
        }
        return null;
      })}
      {game.boardCards.map((card: BoardCard) => {
        if (card.type === "3단계" && card.open) {
          return (
            <div>
              {card.type} {card.pokemon.name}
            </div>
          );
        }
        return null;
      })}
      {game.boardCards.map((card: BoardCard) => {
        if (card.type === "희귀" && card.open) {
          return (
            <div>
              {card.type} {card.pokemon.name}
            </div>
          );
        }
        return null;
      })}
      {game.boardCards.map((card: BoardCard) => {
        if (card.type === "전설" && card.open) {
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
