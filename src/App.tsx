import "./App.css";
import useStores from "./hooks/useStores";
import Main from "./views/main";
import Play from "./views/play";
import { observer } from "mobx-react";

const App = () => {
  const { view } = useStores();
  return (
    <div className="App">{view.name === "main" ? <Main /> : <Play />}</div>
  );
};

export default observer(App);
