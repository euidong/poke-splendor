import { pokemons } from "./stores/const";
import { BallType } from "./stores/game/ball";

const shuffle = (list: any[]) => {
  for (var i = list.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  return list;
};

const pokeNoToName = (pokeNo: number) => {
  return pokemons[pokeNo].name;
};

const pokeNoToNextEvolutionPokemonNo = (pokeNo: number) => {
  return pokemons[pokeNo].next_evolution?.no;
};

const pokeNoToUrl = (pokeNo: number) => {
  let strNo = pokeNo.toString();
  while (strNo.length < 3) {
    strNo = "0" + strNo;
  }
  return `${process.env.PUBLIC_URL}/images/pokemons/${strNo}.png`;
};

const ballTypeToUrl = (ballType: BallType) => {
  return `${process.env.PUBLIC_URL}/images/balls/${ballType.toLowerCase()}.png`;
};

export {
  shuffle,
  pokeNoToName,
  pokeNoToNextEvolutionPokemonNo,
  pokeNoToUrl,
  ballTypeToUrl,
};
