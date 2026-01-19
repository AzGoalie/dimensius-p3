import { createContext } from "react";
import type { Game } from "../core/Game";

export const GameContext = createContext<Game | null>(null);
