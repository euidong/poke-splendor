import { CardProps } from "./type";

const CardBack = ({ card_type }: Omit<CardProps, "side">) => {
  return <div>{card_type}</div>;
};

export default CardBack;
