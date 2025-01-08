import { makeAutoObservable } from "mobx";
import { Nullable } from "../types";

class Controller {
  isBoardInSelectionMode: boolean = false;
  isPlayerStatTgtInSelectionMode: boolean = false;
  isPlayerStatSrcInSelectionMode: boolean = false;

  selectedTgtPokeCardId: Nullable<number> = null;
  selectedSrcPokeCardId: Nullable<number> = null;

  constructor() {
    makeAutoObservable(this);
  }
}

export default Controller;
