import CardBack from "./back";
import CardFront from "./front";
import { CardProps } from "./type";

const Card = ({ side, ...props }: CardProps) => {
  if (side === "Front") return <CardFront {...props} />;
  else return <CardBack {...props} />;
};

export default Card;
