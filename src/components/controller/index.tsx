import styles from "./Controller.module.scss";
import { useState } from "react";
import ActionSelection from "./ActionSelection";
import BallSelection from "./BallSelection";
import Capturing from "./Capturing";
import Evolution from "./Evolution";
import Reservation from "./Reservation";
import { pascalToSnake } from "../../utils";

type ActionType =
  | "ActionSelection"
  | "BallSelection"
  | "Evolution"
  | "Reservation"
  | "Capturing";

type ControllerProps = {
  onFinish?: () => void;
};

const useAction = (initialAction: ActionType) => {
  const [action, _setAction] = useState<ActionType>(initialAction);
  const [history, _setHistory] = useState<ActionType[]>([]);

  const setAction = (new_action: ActionType) => {
    _setHistory([...history, action]);
    _setAction(new_action);
  };

  const moveBack = () => {
    if (history.length === 0) return;
    const previousAction = history[history.length - 1];
    _setHistory(history.slice(0, history.length - 1));
    _setAction(previousAction);
  };

  const reset = () => {
    _setAction(initialAction);
    _setHistory([]);
  };

  return { action, setAction, moveBack, reset };
};

const Controller = ({ onFinish }: ControllerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { action, setAction, moveBack, reset } = useAction("ActionSelection");

  return (
    <div className={styles["controller"]}>
      <header
        className={styles["controller__header"]}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "▼" : "▲"}
      </header>
      {isOpen && (
        <section
          className={styles[`controller__body--${pascalToSnake(action)}`]}
        >
          {action === "ActionSelection" && (
            <ActionSelection setAction={setAction} />
          )}
          {action === "BallSelection" && (
            <BallSelection setAction={setAction} moveBack={moveBack} />
          )}
          {action === "Capturing" && (
            <Capturing setAction={setAction} moveBack={moveBack} />
          )}
          {action === "Evolution" && (
            <Evolution reset={reset} moveBack={moveBack} onFinish={onFinish} />
          )}
          {action === "Reservation" && (
            <Reservation moveBack={moveBack} setAction={setAction} />
          )}
        </section>
      )}
    </div>
  );
};

export type { ActionType };
export default Controller;
