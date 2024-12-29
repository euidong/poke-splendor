import { ActionType } from ".";
import { Nullable } from "../../types";

type ActionSelectionProps = {
  setAction: React.Dispatch<React.SetStateAction<Nullable<ActionType>>>;
};

const ActionSelection = ({ setAction }: ActionSelectionProps) => {
  return (
    <div>
      <button onClick={() => setAction("Capturing")}>Capturing</button>
      <button onClick={() => setAction("BallSelection")}>Ball Selection</button>
    </div>
  );
};

export default ActionSelection;
