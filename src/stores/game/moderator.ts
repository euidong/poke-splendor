import { action, makeAutoObservable } from "mobx";
import Game from ".";
import { Nullable } from "../../types";
import { BallCollection, IBallCollection } from "./ballCollection";
import Peer, { DataConnection } from "peerjs";

interface IModerator {
  game?: Game;
  myPlayerIdx: number;

  subscribe: () => Nullable<Error> | Promise<unknown>;
  publish: (pi: PublishInputs) => Nullable<Error> | Promise<unknown>;
}

class WebRTCModerator implements IModerator {
  game?: Game;
  myPlayerIdx: number;
  myPlayerId: string;
  centralPlayerId: string;
  peer: Peer | undefined;
  connections: DataConnection[];
  peerMap: { [key in 0 | 1 | 2 | 3]: Nullable<string> };

  constructor(myPlayerId: string, centralPlayerId: string) {
    this.game = undefined;
    this.myPlayerIdx = -1; // this mean undefined.
    this.myPlayerId = myPlayerId;
    this.centralPlayerId = centralPlayerId;
    this.peer = undefined;
    this.connections = [];
    this.peerMap = { 0: null, 1: null, 2: null, 3: null };
    makeAutoObservable(this);
  }

  subscribe = async () => {
    return new Promise((resolve, reject) => {
      this.peer = new Peer(this.myPlayerId);
      // central moderator
      if (this.myPlayerId === this.centralPlayerId) {
        this.peer.on("connection", (connection) => {
          this.connections = [...this.connections, connection];
          connection.on("open", () => {
            // send initial status

            // check peer already assigned or not
            let isExist = false;
            let isFull = true;
            Object.entries(this.peerMap).forEach(([peerIdx, peerId]) => {
              if (peerId === connection.peer) {
                isExist = true;
              } else {
                isFull = false;
              }
            });
            // if full
            if (isFull) {
              this.publish({
                type: "ErrorRequest",
                data: { request: null, message: "This room is full" },
              });
              // TODO: must develop more.
              connection.close();
              return;
            }
            // if not, assign
            if (!isExist) {
              for (let idx of [0, 1, 2, 3]) {
                if (this.peerMap[idx as 0 | 1 | 2 | 3] === null) {
                  this.peerMap = { ...this.peerMap, [idx]: connection.peer };
                  break;
                }
              }
            }
            this.publish({
              type: "UpdateConfigResult",
              data: {
                peerMap: this.peerMap,
              },
            });
          });
          connection.on("data", (request: any) => {
            const event = this.deserializeInput(request);
            if (event.type === "CapturePokeCard") {
              if (!!!this.game) {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: "Game is not started" },
                });
                return;
              }
              const error = this.game.capturePokemonCard(
                event.playerIdx,
                event.data.costBallCollection,
                event.data.cardId
              );
              if (!error) {
                this.publish({
                  type: "UpdateGameResult",
                  data: { game: this.game },
                });
              } else {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: error.message },
                });
              }
            } else if (event.type === "EvolvePokeCard") {
              if (!!!this.game) {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: "Game is not started" },
                });
                return;
              }
              const error = this.game.evolvePokemonCard(
                event.playerIdx,
                event.data.srcCardId,
                event.data.tgtCardId
              );
              if (!error) {
                this.publish({
                  type: "UpdateGameResult",
                  data: { game: this.game },
                });
              } else {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: error.message },
                });
              }
            } else if (event.type === "ModifyBallCollection") {
              if (!!!this.game) {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: "Game is not started" },
                });
                return;
              }
              const error = this.game.modifyBallCollection(
                event.playerIdx,
                event.data.ballCollection
              );
              if (!error) {
                this.publish({
                  type: "UpdateGameResult",
                  data: { game: this.game },
                });
              } else {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: error.message },
                });
              }
            } else if (event.type === "UpdateGameResult") {
              // do nothing
            } else if (event.type === "ReservePokeCard") {
              if (!!!this.game) {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: "Game is not started" },
                });
                return;
              }
              const error = this.game.reservePokemonCard(
                event.playerIdx,
                event.data.cardId
              );
              if (!error) {
                this.publish({
                  type: "UpdateGameResult",
                  data: { game: this.game },
                });
              } else {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: error.message },
                });
              }
            } else if (event.type === "FinishTurn") {
              if (!!!this.game) {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: "Game is not started" },
                });
                return;
              }
              if (this.game.turn !== event.playerIdx) {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: "It's not your turn" },
                });
              }
              if (!this.game.isDone()) {
                this.game.nextTurn();
                this.publish({
                  type: "UpdateGameResult",
                  data: { game: this.game },
                });
              } else {
                this.publish({
                  type: "ErrorRequest",
                  data: { request, message: "Game is already done" },
                });
              }
            } else if (event.type === "ErrorRequest") {
              // do nothing
            } else if (event.type === "SetMyPlayerIdx") {
              if (this.peerMap[event.data.playerIdx] === null) {
                // check this peer already occupy some playerIdx or not
                Object.entries(this.peerMap).forEach(([peerIdx, peerId]) => {
                  if (peerId === connection.peer) {
                    this.peerMap[peerIdx as unknown as 0 | 1 | 2 | 3] = null;
                  }
                });
                this.peerMap = {
                  ...this.peerMap,
                  [event.data.playerIdx]: connection.peer,
                };
                this.publish({
                  type: "UpdateConfigResult",
                  data: { peerMap: this.peerMap },
                });
              } else {
                this.publish({
                  type: "ErrorRequest",
                  data: {
                    request,
                    message: `idx(${event.data.playerIdx}) already occupied`,
                  },
                });
              }
            } else if (event.type === "UpdateConfigResult") {
              // do nothing
            }
          });
        });
        this.peer.on("open", () => {
          resolve(null);
        });
        this.peer.on("error", (error) => {
          reject(error);
        });
      }
      // guest moderator
      else {
        new Promise((resolve, reject) => {
          this.peer?.on("open", () => resolve(null));
          this.peer?.on("error", (error) => reject(error));
        }).then(() => {
          if (!!!this.peer) {
            reject();
            return;
          }
          this.peer.on("error", (error) => reject(error));
          this.connections = [this.peer.connect(this.centralPlayerId)];
          this.connections[0].on("data", (request: any) => {
            const event = this.deserializeInput(request);

            if (event.type === "CapturePokeCard") {
              // do nothing
            } else if (event.type === "EvolvePokeCard") {
              // do nothing
            } else if (event.type === "ModifyBallCollection") {
              // do nothing
            } else if (event.type === "UpdateGameResult") {
              this.game = event.data.game;
            } else if (event.type === "ReservePokeCard") {
              // do nothing
            } else if (event.type === "FinishTurn") {
              // do nothing
            } else if (event.type === "ErrorRequest") {
              debugger;
              console.error(`[Error] during proccess ${event.data}`);
            } else if (event.type === "SetMyPlayerIdx") {
              // do nothing
            } else if (event.type === "UpdateConfigResult") {
              this.peerMap = event.data.peerMap;
              Object.entries(this.peerMap).forEach(([peerIdx, peerId]) => {
                if (peerId === this.myPlayerId) {
                  this.myPlayerIdx = peerIdx as unknown as 0 | 1 | 2 | 3;
                }
              });
            }
          });

          this.connections[0].on("open", () => {
            resolve(null);
          });
          this.connections[0].on("error", (error) => reject(error));
        });
      }
    });
  };

  // serialization and deserialization needed (Game, BallCollection)
  publish = async (pi: PublishInputs) => {
    const event = this.serializeEvent(pi);
    return await Promise.all(
      this.connections.map(async (connection) => {
        return await connection.send(event);
      })
    );
  };

  deserializeInput = (input: any) => {
    const event: ActionEvents = {
      playerIdx: Number(input.playerIdx),
      type: input.type,
      data: {
        ...input.data,
      },
    };
    if (event.type === "ModifyBallCollection") {
      event.data.ballCollection = BallCollection.deserialization(
        input.data.ballCollection
      );
    } else if (event.type === "CapturePokeCard") {
      event.data.costBallCollection = BallCollection.deserialization(
        input.data.costBallCollection
      );
    } else if (event.type === "UpdateGameResult") {
      event.data.game = Game.deserialization(input.data.game);
    }
    return event;
  };

  serializeEvent = (pi: PublishInputs) => {
    const event: any = {
      playerIdx: this.myPlayerIdx,
      type: pi.type,
      data: pi.data,
    };
    if (pi.type === "ModifyBallCollection") {
      event.data.ballCollection = pi.data.ballCollection.serialization() as any;
    } else if (pi.type === "CapturePokeCard") {
      pi.data.costBallCollection =
        pi.data.costBallCollection.serialization() as any;
    } else if (pi.type === "UpdateGameResult") {
      pi.data.game = pi.data.game.serialization() as any;
    }
    return event;
  };

  static isPeerExist = async (peerId: string) => {
    return new Promise<boolean>((resolve, reject) => {
      const peer = new Peer(peerId);

      peer.once("open", () => {
        peer.disconnect();
        peer.destroy();
      });
      peer.once("error", (error) => {
        if (error.type === "unavailable-id") {
          resolve(true);
        } else {
          reject(error);
        }
      });
      const timer = setInterval(() => {
        if (peer.destroyed) {
          clearInterval(timer);
          resolve(false);
        }
      }, 100);
    });
  };
}

class LocalModerator implements IModerator {
  game?: Game;
  myPlayerIdx: number;
  centralPlayerIdx: number;

  init = (numPlayers: 2 | 3 | 4) => {
    this.game = new Game();
    this.game.init(numPlayers);
    this.publish({ type: "UpdateGameResult", data: { game: this.game } });
    return null;
  };

  // TODO: check difference between CustomEvent and CustomEventInit
  subscribe = () => {
    document.addEventListener(
      "poke-splender-action",
      (e: CustomEventInit<ActionEvents>) => {
        if (this.myPlayerIdx === this.centralPlayerIdx) {
          if (!!!e.detail) {
            return;
          } else if (e.detail.type === "CapturePokeCard") {
            if (!!!this.game) {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: "Game is not started" },
              });
              return;
            }
            const error = this.game.capturePokemonCard(
              e.detail.playerIdx,
              e.detail.data.costBallCollection,
              e.detail.data.cardId
            );
            if (!error) {
              this.publish({
                type: "UpdateGameResult",
                data: { game: this.game },
              });
            } else {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: error.message },
              });
            }
          } else if (e.detail.type === "EvolvePokeCard") {
            if (!!!this.game) {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: "Game is not started" },
              });
              return;
            }
            const error = this.game.evolvePokemonCard(
              e.detail.playerIdx,
              e.detail.data.srcCardId,
              e.detail.data.tgtCardId
            );
            if (!error) {
              this.publish({
                type: "UpdateGameResult",
                data: { game: this.game },
              });
            } else {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: error.message },
              });
            }
          } else if (e.detail.type === "ModifyBallCollection") {
            if (!!!this.game) {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: "Game is not started" },
              });
              return;
            }
            const error = this.game.modifyBallCollection(
              e.detail.playerIdx,
              e.detail.data.ballCollection
            );
            if (!error) {
              this.publish({
                type: "UpdateGameResult",
                data: { game: this.game },
              });
            } else {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: error.message },
              });
            }
          } else if (e.detail.type === "UpdateGameResult") {
            // do nothing
          } else if (e.detail.type === "ReservePokeCard") {
            if (!!!this.game) {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: "Game is not started" },
              });
              return;
            }
            const error = this.game.reservePokemonCard(
              e.detail.playerIdx,
              e.detail.data.cardId
            );
            if (!error) {
              this.publish({
                type: "UpdateGameResult",
                data: { game: this.game },
              });
            } else {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: error.message },
              });
            }
          } else if (e.detail.type === "FinishTurn") {
            if (!!!this.game) {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: "Game is not started" },
              });
              return;
            }
            if (this.game.turn !== e.detail.playerIdx) {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: "It's not your turn" },
              });
            }
            if (!this.game.isDone()) {
              this.game.nextTurn();
              this.publish({
                type: "UpdateGameResult",
                data: { game: this.game },
              });
            } else {
              this.publish({
                type: "ErrorRequest",
                data: { request: e.detail, message: "Game is already done" },
              });
            }
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
          } else if (e.detail.type === "UpdateGameResult") {
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

  constructor(myPlayerIdx: number, centralPlayerIdx: number) {
    this.game = undefined;
    this.myPlayerIdx = myPlayerIdx;
    this.centralPlayerIdx = centralPlayerIdx;

    this.subscribe();
    makeAutoObservable(this);
  }
}

const ActionEventTypes = [
  // for Game
  "ModifyBallCollection", //from player
  "CapturePokeCard", // from player
  "ReservePokeCard", // from player
  "EvolvePokeCard", // from player
  "FinishTurn", // from player
  "UpdateGameResult", // from central
  "ErrorRequest", // from central

  // for Online
  "SetMyPlayerIdx", // from player
  "UpdateConfigResult", // from central
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
export type UpdateGameResultData = {
  game: Game;
};
export type ErrorRequestData = {
  request: Nullable<ActionEvents>;
  message: Nullable<string>;
};

export type ReservePokeCardData = {
  cardId: number;
};

export type FinishTurnData = {};

export type SetMyPlayerIdxData = {
  playerIdx: 0 | 1 | 2 | 3;
};

export type UpdateConfigResultData = {
  peerMap: { [key in 0 | 1 | 2 | 3]: Nullable<string> };
};

type ActionEventDataMap = {
  ModifyBallCollection: ModifyBallCollectionData;
  CapturePokeCard: CapturePokeCardData;
  EvolvePokeCard: EvolvePokeCardData;
  ReservePokeCard: ReservePokeCardData;
  FinishTurn: FinishTurnData;
  UpdateGameResult: UpdateGameResultData;
  ErrorRequest: ErrorRequestData;

  SetMyPlayerIdx: SetMyPlayerIdxData;
  UpdateConfigResult: UpdateConfigResultData;
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

class WebRTCModerators {
  moderators: WebRTCModerator[] = [];

  constructor(moderators: WebRTCModerator[] = []) {
    this.moderators = moderators;
    makeAutoObservable(this, { set: action });
  }

  set(moderators: WebRTCModerator[]) {
    this.moderators = moderators;
  }

  get(idx: number) {
    return this.moderators[idx];
  }

  getAll() {
    return this.moderators;
  }

  isExist() {
    return this.moderators.length > 0;
  }
}

const startLocalGame = (numPlayers: 2 | 3 | 4) => {
  const moderators = [];
  for (let i = 0; i < numPlayers; i++) {
    const moderator = new LocalModerator(i, 0);
    moderators.push(moderator);
  }
  moderators[0].init(numPlayers);
  const lms = new LocalModerators(moderators);
  return { lms };
};

const createRemoteGameRoom = async (centralPlayerId: string) => {
  const guestId = crypto.randomUUID();

  const moderators = new WebRTCModerators([
    new WebRTCModerator(guestId, centralPlayerId),
    new WebRTCModerator(centralPlayerId, centralPlayerId),
  ]);

  try {
    await moderators.get(1).subscribe();
    await moderators.get(0).subscribe();
  } catch (e) {
    console.error(e);
  }

  return { moderators };
};

const joinRemoteGameRoom = async (centralPlayerId: string) => {
  const guestId = crypto.randomUUID();
  const moderators = new WebRTCModerators([
    new WebRTCModerator(guestId, centralPlayerId),
  ]);
  moderators.get(0).subscribe();

  return { moderators };
};

const isRemoteGameRoomExist = async (peerId: string) => {
  return await WebRTCModerator.isPeerExist(peerId);
};

export type { IModerator };
export {
  LocalModerator,
  WebRTCModerator,
  LocalModerators,
  WebRTCModerators,
  startLocalGame,
  createRemoteGameRoom,
  joinRemoteGameRoom,
  isRemoteGameRoomExist,
};
