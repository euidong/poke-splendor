import { BallCollection } from "./game/ballCollection";
import { Card, CardType } from "./game/card";
import { IPokemon } from "./game/pokemon";

import Papa from "papaparse";

const pokemons: { [key: number]: IPokemon } = {};

const cards: { [key: number]: Card } = {};

Papa.parse(`${process.env.PUBLIC_URL}/data/pokemon.csv`, {
  download: true,
  header: true,
  complete: (pokeInfos) => {
    pokeInfos.data.reverse().forEach((pokeInfo: any) => {
      const pokemon_no = pokeInfo["no"];
      const pokemon_name = pokeInfo["name"];
      const evolution_pokemon_no = Number(pokeInfo["evolution_pokemon_no"]);
      const evolution_pokemon = pokemons[evolution_pokemon_no];

      pokemons[pokemon_no] = {
        no: pokemon_no,
        name: pokemon_name,
        next_evolution: evolution_pokemon ? evolution_pokemon : null,
      };
    });

    Papa.parse(`${process.env.PUBLIC_URL}/data/card.csv`, {
      download: true,
      header: true,
      complete: (cardInfos) => {
        cardInfos.data.forEach((cardInfo: any, idx: number) => {
          cards[idx + 1] = new Card({
            id: idx + 1,
            score: Number(cardInfo["score"]),
            type: cardInfo["card_type"] as CardType, // TODO: change
            pokemon: pokemons[Number(cardInfo["pokemon_no"])],

            neededBallsForCapturing: new BallCollection({
              masterBall: Number(cardInfo["required_master_ball_cnt"]),
              ultraBall: Number(cardInfo["required_ultra_ball_cnt"]),
              healBall: Number(cardInfo["required_heal_ball_cnt"]),
              quickBall: Number(cardInfo["required_quick_ball_cnt"]),
              greatBall: Number(cardInfo["required_great_ball_cnt"]),
              pokeBall: Number(cardInfo["required_poke_ball_cnt"]),
            }),
            neededBallsForEvolution: new BallCollection({
              masterBall:
                cardInfo["evolution_ball_type"] === "마스터볼"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
              ultraBall:
                cardInfo["evolution_ball_type"] === "울트라볼"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
              healBall:
                cardInfo["evolution_ball_type"] === "힐볼"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
              quickBall:
                cardInfo["evolution_ball_type"] === "퀵볼"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
              greatBall:
                cardInfo["evolution_ball_type"] === "슈퍼볼"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
              pokeBall:
                cardInfo["evolution_ball_type"] === "몬스터볼"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
            }),
            rewardBalls: new BallCollection({
              masterBall:
                cardInfo["reward_ball_type"] === "마스터볼"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
              ultraBall:
                cardInfo["reward_ball_type"] === "울트라볼"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
              healBall:
                cardInfo["reward_ball_type"] === "힐볼"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
              quickBall:
                cardInfo["reward_ball_type"] === "퀵볼"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
              greatBall:
                cardInfo["reward_ball_type"] === "슈퍼볼"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
              pokeBall:
                cardInfo["reward_ball_type"] === "몬스터볼"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
            }),
          });
        });
      },
    });
  },
});

export { pokemons, cards };
