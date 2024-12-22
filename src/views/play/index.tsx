import "./play.scss";

import BoardStat from "../../components/boardStat";
import Board from "../../components/board";
import PlayerStat from "../../components/playerStat";
import Controller from "../../components/controller";

const Play = () => {
  return (
    <div>
      <BoardStat />
      <Board />
      <PlayerStat />
      <Controller />
    </div>
  );
};

export default Play;
