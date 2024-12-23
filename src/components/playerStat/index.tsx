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
              마스터볼: {player.ballCollection.balls.masterBall} | 하이퍼볼:{" "}
              {player.ballCollection.balls.ultraBall} | 퀵볼:{" "}
              {player.ballCollection.balls.quickBall} | 힐볼:{" "}
              {player.ballCollection.balls.healBall} | 슈퍼볼:{" "}
              {player.ballCollection.balls.greatBall} | 몬스터볼:{" "}
              {player.ballCollection.balls.pokeBall}
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
