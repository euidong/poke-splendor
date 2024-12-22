import { Nullable } from "../../types";
interface IPokemon {
  no: number;
  name: string;
  next_evolution: Nullable<IPokemon>;
}

export type { IPokemon };
