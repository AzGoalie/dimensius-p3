import { useGameState } from "./useGameState";

const Score = () => {
  const score = useGameState((s) => s.score);
  const multiplier = useGameState((s) => s.multiplier);

  return (
    <div className="text-white w-30">
      Score: {score} <br /> x{multiplier}
    </div>
  );
};

export default Score;
