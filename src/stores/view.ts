import { makeAutoObservable } from "mobx";

class View {
  name: string = "main";

  constructor() {
    makeAutoObservable(this);
  }

  set(name: string) {
    this.name = name;
  }
}

export default View;
