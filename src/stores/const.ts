import { BallCollection } from "./game/ballCollection";
import { Card, CardType } from "./game/card";
import { IPokemon } from "./game/pokemon";

import Papa from "papaparse";

const pokemons: { [key: number]: IPokemon } = {};

const cards: { [key: number]: Card } = {};

const loadConsts = (isLocal: boolean = false, callback?: Function) => {
  let targetPokemonUrl = "";
  let targetCardUrl = "";
  const onCardLoadSucceed = (cardInfos: Papa.ParseResult<unknown>) => {
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
    callback && callback();
  };
  const onPokemonLoadSucceed = (pokeInfos: Papa.ParseResult<unknown>) => {
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

    if (isLocal) {
      Papa.parse(targetCardUrl, {
        download: false,
        header: true,
        complete: onCardLoadSucceed,
      });
    } else {
      Papa.parse(targetCardUrl, {
        download: true,
        header: true,
        complete: onCardLoadSucceed,
      });
    }
  };

  if (isLocal) {
    const fs = require("fs");

    targetPokemonUrl = fs
      .readFileSync(
        `/Users/euidong/projects/poke-splendor/public/data/pokemon.csv`
      )
      .toString();
    targetCardUrl = fs
      .readFileSync(
        `/Users/euidong/projects/poke-splendor/public/data/card.csv`
      )
      .toString();
    Papa.parse(targetPokemonUrl, {
      download: false,
      header: true,
      complete: onPokemonLoadSucceed,
    });
  } else {
    targetPokemonUrl = `${process.env.PUBLIC_URL}/data/pokemon.csv`;
    targetCardUrl = `${process.env.PUBLIC_URL}/data/card.csv`;
    Papa.parse(targetPokemonUrl, {
      download: true,
      header: true,
      complete: onPokemonLoadSucceed,
    });
  }
};

const loadConstsAsync = async (isLocal: boolean = false, timeout?: number) => {
  return new Promise((resolve, reject) => {
    timeout && setTimeout(reject, timeout);
    loadConsts(isLocal, resolve);
  });
};

const desiredOpenCardNumInBoard: { [key in CardType]: number } = {
  Tier1: 4,
  Tier2: 4,
  Tier3: 4,
  Rare: 1,
  Legendary: 1,
};

const desiredPlayerNums: (2 | 3 | 4)[] = [2, 3, 4];

const desiredInitialBoardBallCollectionsPerPlayerNums = {
  2: new BallCollection({
    masterball: 5,
    pokeball: 4,
    quickball: 4,
    healball: 4,
    greatball: 4,
    ultraball: 4,
  }),
  3: new BallCollection({
    masterball: 5,
    pokeball: 5,
    quickball: 5,
    healball: 5,
    greatball: 5,
    ultraball: 5,
  }),
  4: new BallCollection({
    masterball: 5,
    pokeball: 7,
    quickball: 7,
    healball: 7,
    greatball: 7,
    ultraball: 7,
  }),
};

const emptyBallCollection = new BallCollection({
  pokeball: 0,
  greatball: 0,
  ultraball: 0,
  healball: 0,
  quickball: 0,
  masterball: 0,
});

export {
  loadConsts,
  loadConstsAsync,
  pokemons,
  cards,
  desiredOpenCardNumInBoard,
  desiredPlayerNums,
  desiredInitialBoardBallCollectionsPerPlayerNums,
  emptyBallCollection,
};
