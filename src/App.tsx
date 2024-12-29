import "./App.css";
import useStores from "./hooks/useStores";
import BallList from "./views/ballList";
import CardList from "./views/cardList";
import CharacterList from "./views/characterList";
import Main from "./views/main";
import Play from "./views/play";
import { observer } from "mobx-react";
import { BrowserRouter, Route, Routes } from "react-router";

const App = () => {
  const { view } = useStores();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={view.name === "main" ? <Main /> : <Play />} />
        <Route path="/cards" element={<CardList />} />
        <Route path="/balls" element={<BallList />} />
        <Route path="/characters" element={<CharacterList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default observer(App);
