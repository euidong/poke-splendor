import "./App.css";
import useStores from "./hooks/useStores";
import CardList from "./views/cardList";
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
        <Route path="/card-list" element={<CardList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default observer(App);
