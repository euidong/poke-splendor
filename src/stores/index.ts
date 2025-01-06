import Controller from "./controller";
import { LocalModerators } from "./game/moderator";
import Input from "./input";
import View from "./view";

const stores = {
  view: new View(),
  game: undefined,
  moderators: new LocalModerators(),
  input: new Input(),
  controller: new Controller(),
};

export default stores;
