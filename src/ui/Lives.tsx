import { useGameState } from "./useGameState";

const Lives = () => {
  const lives = useGameState((s) => s.lives);

  return <div className="text-white">Lives: {lives}</div>;
};

export default Lives;
