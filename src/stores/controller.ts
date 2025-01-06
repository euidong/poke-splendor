import { makeAutoObservable } from "mobx";

class Controller {
  isBoardInSelectionMode: boolean = false;
  isPlayerStatTgtInSelectionMode: boolean = false;
  isPlayerStatSrcInSelectionMode: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }
}

export default Controller;
