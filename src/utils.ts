import { pokemons } from "./stores/const";
import { BallType } from "./stores/game/ball";
import { CharacterType } from "./stores/game/character";

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

const characterTypeToUrl = (characterType: CharacterType) => {
  return `${
    process.env.PUBLIC_URL
  }/images/characters/${characterType.toLowerCase()}.png`;
};

const ballTypeToColor = (ballType: BallType, isMain: boolean) => {
  if (isMain) {
    switch (ballType) {
      case "pokeball":
        return "#F37562";
      case "greatball":
        return "#55A5D0";
      case "ultraball":
        return "#767170";
      case "quickball":
        return "#FCDF55";
      case "healball":
        return "#E0A1C2";
      case "masterball":
        return "#5E3A84";
      default:
        return "#FFF";
    }
  } else {
    switch (ballType) {
      case "pokeball":
        return "#F9B499";
      case "greatball":
        return "#B6E4FB";
      case "ultraball":
        return "#D8D8DB";
      case "quickball":
        return "#FDFAC5";
      case "healball":
        return "#FEEFF6";
      case "masterball":
        return "#865EAF";
      default:
        return "#FFF";
    }
  }
};

const pascalToSnake = (str: string) => {
  str = str.charAt(0).toLowerCase() + str.slice(1);
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
};

export {
  shuffle,
  pokeNoToName,
  pokeNoToNextEvolutionPokemonNo,
  pokeNoToUrl,
  ballTypeToUrl,
  characterTypeToUrl,
  ballTypeToColor,
  pascalToSnake,
};
