import "./App.css";
import Controller from "./components/controller";
import Frame from "./components/Frame";
import BallList from "./views/ballList";
import CardList from "./views/cardList";
import CharacterList from "./views/characterList";
import { observer } from "mobx-react";
import { BrowserRouter, Route, Routes } from "react-router";
import PlayerStat from "./views/playerStat";
import WebRtcTest from "./views/webRtcTest";
import LocalPlay from "./views/localPlay";
import Home from "./views/home";
import OnlineLobby from "./views/onlineLobby";
import OnlinePlay from "./views/onlinePlay";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`${process.env.PUBLIC_URL}/`} element={<Home />} />
        <Route
          path={`${process.env.PUBLIC_URL}/local`}
          element={<LocalPlay />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/lobby`}
          element={<OnlineLobby />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/online`}
          element={<OnlinePlay />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/cards`}
          element={<CardList />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/balls`}
          element={<BallList />}
        />
        <Route
          path={`${process.env.PUBLIC_URL}/characters`}
          element={<CharacterList />}
        />
        <Route
          path="/controller"
          element={
            <Frame debug={true}>
              <div style={{ display: "flex", flex: 1 }} />
              <Controller />
            </Frame>
          }
        />
        <Route path="/player-stat" element={<PlayerStat />} />
        <Route path="/webrtc-test" element={<WebRtcTest />} />
      </Routes>
    </BrowserRouter>
  );
};

export default observer(App);
