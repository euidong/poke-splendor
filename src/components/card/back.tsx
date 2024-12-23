import styles from "./Card.module.scss";
import { CardProps } from "./type";

const CardBack = ({ card_type }: Omit<CardProps, "side">) => {
  const backgroundColor =
    card_type === "Tier1"
      ? "#1F7F22"
      : card_type === "Tier2"
      ? "#D7682F"
      : card_type === "Tier3"
      ? "#3D78B4"
      : card_type === "Rare"
      ? "#ED86BA"
      : "#9E46BE";
  return (
    <div
      className={styles["card--back"]}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className={styles["card--back__wrapper"]}>
        <header className={styles["card--back__wrapper__header"]}>
          <div>Splendor</div>
        </header>
        <section className={styles["card--back__wrapper__body"]}>
          <div>Pokémon</div>
        </section>
        <footer className={styles["card--back__wrapper__footer"]}>
          <div>{card_type}</div>
        </footer>
      </div>
    </div>
  );
};

export default CardBack;
