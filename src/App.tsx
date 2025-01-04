import "./App.css";
import Controller from "./components/controller";
import Frame from "./components/Frame";
import useStores from "./hooks/useStores";
import { IModerator } from "./stores/game/moderator";
import BallList from "./views/ballList";
import CardList from "./views/cardList";
import CharacterList from "./views/characterList";
import Main from "./views/main";
import Play from "./views/play";
import { observer } from "mobx-react";
import { BrowserRouter, Route, Routes } from "react-router";

const App = () => {
  const { view, moderators } = useStores();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            view.name === "main" ? (
              <Main />
            ) : (
              <>
                {moderators.map((moderator: IModerator, idx: number) => (
                  <Play key={idx} playerIdx={idx} />
                ))}
              </>
            )
          }
        />
        <Route path="/cards" element={<CardList />} />
        <Route path="/balls" element={<BallList />} />
        <Route path="/characters" element={<CharacterList />} />
        <Route
          path="/controller"
          element={
            <Frame debug={true}>
              <div style={{ display: "flex", flex: 1 }} />
              <Controller />
            </Frame>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default observer(App);
