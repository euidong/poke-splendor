import Controller from "./controller";
import { LocalModerators, WebRTCModerators } from "./game/moderator";
import Input from "./input";

const stores = {
  localModerators: new LocalModerators(),
  onlineModerators: new WebRTCModerators(),

  input: new Input(),
  controller: new Controller(),
};

export default stores;
