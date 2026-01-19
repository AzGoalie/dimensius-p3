import type { PropsWithChildren } from "react";
import { GameContext } from "./GameContext";
import type { Game } from "../core/Game";

interface Props extends PropsWithChildren {
  game: Game;
}

export const GameProvider = ({ game, children }: Props) => {
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};
