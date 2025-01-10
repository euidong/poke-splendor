import Character from "../../components/chracter";
import { CharacterTypes } from "../../stores/game/character";
import styles from "./CharacterList.module.scss";

const CharacterList = () => {
  return (
    <div className={styles["character_list"]}>
      <div className={styles["character_list__title"]}>Characters</div>
      <div className={styles["character_list__wrapper"]}>
        {CharacterTypes.map((type) => (
          <Character type={type} />
        ))}
      </div>
    </div>
  );
};

export default CharacterList;
