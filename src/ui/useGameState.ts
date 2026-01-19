import { useCallback, useContext, useSyncExternalStore } from "react";
import { GameContext } from "./GameContext";

export function useGameState(selector: (state: any) => any) {
  const game = useContext(GameContext);

  if (!game) {
    throw new Error("useGameState must be used within a GameProvider");
  }

  const getSelectedSnapshot = useCallback(() => {
    return selector(game.getSnapshot());
  }, [game, selector]);

  const state = useSyncExternalStore(game.subscribe, getSelectedSnapshot);

  return state;
}
