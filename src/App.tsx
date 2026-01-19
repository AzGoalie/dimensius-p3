import { useState } from "react";
import MainMenu from "./ui/MainMenu";
import Lives from "./ui/Lives";
import Score from "./ui/Score";
import AttackSequence from "./ui/AttackSequence";
import { useGameState } from "./ui/useGameState";
import { Skull, Trophy } from "lucide-react";

interface Props {
  onPlay: () => void;
}

function App({ onPlay }: Props) {
  const hasWon = useGameState((s) => s.won);
  const hasLoss = useGameState((s) => s.loss);
  const score = useGameState((s) => s.score);
  const [playing, setPlaying] = useState(false);

  return (
    <>
      {!playing && (
        <MainMenu
          onPlay={() => {
            setPlaying(true);
            onPlay();
          }}
        />
      )}

      {playing && (
        <div className="grid w-full grid-cols-3 gap-4 p-4">
          <Lives />
          <AttackSequence />
          <div className="flex justify-end">
            <Score />
          </div>
        </div>
      )}

      {hasWon && (
        <div className="absolute inset-0 bg-green-900/90 flex flex-col items-center justify-center z-50 animate-in fade-in duration-500">
          <Trophy size={80} className="text-yellow-400 mb-4 animate-pulse" />
          <h1 className="text-6xl font-black text-white mb-2">VICTORY</h1>
          <p className="text-green-200 pb-8 text-xl">
            Your final score: {score}
          </p>

          <button
            onClick={() => {
              setPlaying(true);
              onPlay();
            }}
            className="px-8 py-3 bg-white text-green-900 font-bold rounded hover:bg-slate-200 transition-colors"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {hasLoss && (
        <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center z-50 animate-in fade-in duration-500">
          <Skull size={80} className="text-white mb-4 animate-bounce" />
          <h1 className="text-6xl font-black text-white mb-2">YOU DIED</h1>
          <p className="text-red-200 mb-8 text-xl">You have wiped the raid.</p>
          <button
            onClick={() => {
              setPlaying(true);
              onPlay();
            }}
            className="px-8 py-3 bg-white text-red-900 font-bold rounded hover:bg-slate-200 transition-colors"
          >
            TRY AGAIN
          </button>
        </div>
      )}
    </>
  );
}

export default App;
