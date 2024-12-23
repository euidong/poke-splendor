import useStores from "../../hooks/useStores";
import Game from "../../stores/game";

const PlayerStat = () => {
  const stores = useStores();
  const game: Game = stores.game;

  return (
    <div>
      <div>[PlayerStat]</div>

      <ul>
        {game.players.map((player) => (
          <li>
            <div>{player.character}</div>
            <div>
              masterball: {player.ballCollection.balls.masterball} | ultraball:{" "}
              {player.ballCollection.balls.ultraball} | quickball:{" "}
              {player.ballCollection.balls.quickball} | healball:{" "}
              {player.ballCollection.balls.healball} | greatball:{" "}
              {player.ballCollection.balls.greatball} | pokeball:{" "}
              {player.ballCollection.balls.pokeball}
            </div>
            <div># 진화한 포켓몬: {player.getEvolutionCnt()}</div>
            <ul>
              <div>잡은 포켓몬</div>
              {player.capturedCards.map((card) => (
                <li>{card.pokemon.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerStat;
