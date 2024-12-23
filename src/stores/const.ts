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
              masterball: Number(cardInfo["required_master_ball_cnt"]),
              ultraball: Number(cardInfo["required_ultra_ball_cnt"]),
              healball: Number(cardInfo["required_heal_ball_cnt"]),
              quickball: Number(cardInfo["required_quick_ball_cnt"]),
              greatball: Number(cardInfo["required_great_ball_cnt"]),
              pokeball: Number(cardInfo["required_poke_ball_cnt"]),
            }),
            neededBallsForEvolution: new BallCollection({
              masterball:
                cardInfo["evolution_ball_type"] === "masterball"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
              ultraball:
                cardInfo["evolution_ball_type"] === "ultraball"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
              healball:
                cardInfo["evolution_ball_type"] === "healball"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
              quickball:
                cardInfo["evolution_ball_type"] === "quickball"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
              greatball:
                cardInfo["evolution_ball_type"] === "greatball"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
              pokeball:
                cardInfo["evolution_ball_type"] === "pokeball"
                  ? Number(cardInfo["evolution_ball_cnt"])
                  : 0,
            }),
            rewardBalls: new BallCollection({
              masterball:
                cardInfo["reward_ball_type"] === "masterball"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
              ultraball:
                cardInfo["reward_ball_type"] === "ultraball"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
              healball:
                cardInfo["reward_ball_type"] === "healball"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
              quickball:
                cardInfo["reward_ball_type"] === "quickball"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
              greatball:
                cardInfo["reward_ball_type"] === "greatball"
                  ? Number(cardInfo["reward_ball_cnt"])
                  : 0,
              pokeball:
                cardInfo["reward_ball_type"] === "pokeball"
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
