import styles from "./Controller.module.scss";
import { useState } from "react";
import { Nullable } from "../../types";
import ActionSelection from "./ActionSelection";
import BallSelection from "./BallSelection";
import Capturing from "./Capturing";
import Evolution from "./Evolution";
import Reservation from "./Reservation";

type ActionType = "BallSelection" | "Evolution" | "Reservation" | "Capturing";

const Controller = () => {
  const [action, setAction] = useState<Nullable<ActionType>>(null);
  return (
    <div className={styles["controller"]}>
      {!!!action && <ActionSelection setAction={setAction} />}
      {action === "BallSelection" && <BallSelection />}
      {action === "Capturing" && <Capturing />}
      {action === "Evolution" && <Evolution />}
      {action === "Reservation" && <Reservation />}
    </div>
  );
};

export type { ActionType };
export default Controller;
