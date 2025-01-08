import { makeAutoObservable } from "mobx";
import Game from ".";
import { Nullable } from "../../types";
import { IBallCollection } from "./ballCollection";

interface IModerator {
  game: Game;
  myPlayerIdx: number;

  subscribe: () => Nullable<Error>;
  publish: (pi: PublishInputs) => Nullable<Error>;
}

class WebRTCModerator implements IModerator {
  game: Game;
  myPlayerIdx: number;

  constructor(game: Game, myPlayerIdx: number, centralModeratorIdx: number) {
    this.game = game;
    this.myPlayerIdx = myPlayerIdx;
  }

  subscribe = () => {
    return null;
  };

  publish = () => {
    return null;
  };
}

class LocalModerator implements IModerator {
  game: Game;
  myPlayerIdx: number;
  centralPlayerIdx: number;

  init = (numPlayers: 2 | 3 | 4) => {
    this.game.init(numPlayers);
    this.publish({ type: "UpdateResult", data: { game: this.game } });
    return null;
  };

  // TODO: check difference between CustomEvent and CustomEventInit
  subscribe = () => {
    document.addEventListener(
      "poke-splender-action",
      (e: CustomEventInit<ActionEvents>) => {
        if (this.myPlayerIdx === this.centralPlayerIdx) {
          if (!!!e.detail) {
          } else if (e.detail.type === "CapturePokeCard") {
            const success = this.game.capturePokemonCard(
              e.detail.playerIdx,
              e.detail.data.costBallCollection,
              e.detail.data.cardId
            );
            if (success) {
              this.publish({ type: "UpdateResult", data: { game: this.game } });
            } else {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail },
              });
            }
          } else if (e.detail.type === "EvolvePokeCard") {
            const success = this.game.evolvePokemonCard(
              e.detail.playerIdx,
              e.detail.data.srcCardId,
              e.detail.data.tgtCardId
            );
            if (success) {
              this.publish({ type: "UpdateResult", data: { game: this.game } });
            } else {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail },
              });
            }
          } else if (e.detail.type === "ModifyBallCollection") {
            const success = this.game.modifyBallCollection(
              e.detail.playerIdx,
              e.detail.data.ballCollection
            );
            if (success) {
              this.publish({ type: "UpdateResult", data: { game: this.game } });
            } else {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail },
              });
            }
          } else if (e.detail.type === "UpdateResult") {
            // do nothing
          } else if (e.detail.type === "ReservePokeCard") {
            const success = this.game.reservePokemonCard(
              e.detail.playerIdx,
              e.detail.data.cardId
            );
            if (success) {
              this.publish({ type: "UpdateResult", data: { game: this.game } });
            } else {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail },
              });
            }
          } else if (e.detail.type === "FinishTurn") {
            if (this.game.turn !== e.detail.playerIdx) {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail },
              });
            }
            this.game.nextTurn();
            this.publish({ type: "UpdateResult", data: { game: this.game } });
          } else if (e.detail.type === "ErrorRequest") {
            // do nothing
          }
        } else {
          if (!!!e.detail) {
          } else if (e.detail.type === "CapturePokeCard") {
            // do nothing
          } else if (e.detail.type === "EvolvePokeCard") {
            // do nothing
          } else if (e.detail.type === "ModifyBallCollection") {
            // do nothing
          } else if (e.detail.type === "UpdateResult") {
            this.game = e.detail.data.game;
          } else if (e.detail.type === "ReservePokeCard") {
            // do nothing
          } else if (e.detail.type === "FinishTurn") {
            // do nothing
          } else if (e.detail.type === "ErrorRequest") {
            console.error(`[Error] during proccess ${e.detail.data}`);
          }
        }
      }
    );
    return null;
  };

  publish = (pi: PublishInputs) => {
    document.dispatchEvent(
      new CustomEvent<ActionEvents>("poke-splender-action", {
        detail: {
          playerIdx: this.myPlayerIdx,
          ...pi,
        },
      })
    );
    return null;
  };

  constructor(game: Game, myPlayerIdx: number, centralPlayerIdx: number) {
    this.game = game;
    this.myPlayerIdx = myPlayerIdx;
    this.centralPlayerIdx = centralPlayerIdx;

    this.subscribe();
    makeAutoObservable(this);
  }
}

const ActionEventTypes = [
  "ModifyBallCollection",
  "CapturePokeCard",
  "ReservePokeCard",
  "EvolvePokeCard",
  "UpdateResult",
  "FinishTurn",
  "ErrorRequest",
] as const;

export type ActionEventType = (typeof ActionEventTypes)[number];

export type ModifyBallCollectionData = {
  ballCollection: IBallCollection;
};
export type CapturePokeCardData = {
  costBallCollection: IBallCollection;
  cardId: number;
};
export type EvolvePokeCardData = {
  srcCardId: number;
  tgtCardId: number;
};
export type UpdateResultData = {
  game: Game;
};
export type ErrorRequestData = {
  request: ActionEvents;
};

export type ReservePokeCardData = {
  cardId: number;
};

export type FinishTurnData = {};

type ActionEventDataMap = {
  ModifyBallCollection: ModifyBallCollectionData;
  CapturePokeCard: CapturePokeCardData;
  EvolvePokeCard: EvolvePokeCardData;
  UpdateResult: UpdateResultData;
  ErrorRequest: ErrorRequestData;
  ReservePokeCard: ReservePokeCardData;
  FinishTurn: FinishTurnData;
};

export type ActionEvent<T extends ActionEventType> = {
  playerIdx: number;
  type: T;
  data: ActionEventDataMap[T];
};

export type PublishInput<T extends ActionEventType> = Omit<
  ActionEvent<T>,
  "playerIdx"
>;

export type PublishInputs = {
  [K in ActionEventType]: PublishInput<K>;
}[ActionEventType];

type ActionEvents = {
  [K in ActionEventType]: ActionEvent<K>;
}[ActionEventType];

const startLocalGame = (numPlayers: 2 | 3 | 4) => {
  const game = new Game();
  const moderators = [];
  for (let i = 0; i < numPlayers; i++) {
    moderators.push(new LocalModerator(game, i, 0));
  }
  moderators[0].init(numPlayers);
  const lms = new LocalModerators(moderators);
  return { game, lms };
};

class LocalModerators {
  moderators: LocalModerator[] = [];

  constructor(moderators: LocalModerator[] = []) {
    this.moderators = moderators;
    makeAutoObservable(this);
  }

  get(idx: number) {
    return this.moderators[idx];
  }

  getAll() {
    return this.moderators;
  }
}

export type { IModerator };
export { LocalModerator, WebRTCModerator, startLocalGame, LocalModerators };
