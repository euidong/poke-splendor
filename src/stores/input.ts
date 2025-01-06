import { makeAutoObservable } from "mobx";
import { BallCollection } from "./game/ballCollection";
import { Nullable } from "../types";

class Input {
  selectedTgtPokeCardNo: Nullable<number> = null;
  selectedSrcPokeCardNo: Nullable<number> = null;

  // For ModifyBallCollection
  ballCollectionForModifying: Nullable<BallCollection> = null;

  // For CapturePokeCard
  targetCapturePokeCardId: Nullable<number> = null;
  ballCollectionForCapturing: Nullable<BallCollection> = null;

  // For ReservePokeCard
  targetReservePokeCardId: Nullable<number> = null;

  // For EvolvePokeCard
  sourceEvolvePokeCardId: Nullable<number> = null;
  targetEvolvePokeCardId: Nullable<number> = null;

  constructor() {
    makeAutoObservable(this);
  }

  clear() {
    this.selectedTgtPokeCardNo = null;
    this.selectedSrcPokeCardNo = null;

    this.ballCollectionForModifying = null;

    this.targetCapturePokeCardId = null;
    this.ballCollectionForCapturing = null;

    this.targetReservePokeCardId = null;

    this.sourceEvolvePokeCardId = null;
    this.targetEvolvePokeCardId = null;
  }
}

export default Input;
