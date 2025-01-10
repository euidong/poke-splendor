import styles from "./Character.module.scss";
import { CharacterType } from "../../stores/game/character";
import { characterTypeToUrl } from "../../utils";

type CharacterProps = {
  type: CharacterType;
};
const Character = ({ type }: CharacterProps) => {
  return (
    <div className={styles["character"]}>
      <div className={styles["character__title"]}>{type}</div>
      <div className={styles["character__image"]}>
        <img src={characterTypeToUrl(type)} alt={type} />
      </div>
    </div>
  );
};

export default Character;
