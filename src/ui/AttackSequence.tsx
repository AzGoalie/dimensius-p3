import { useGameState } from "./useGameState";

const AttackSequence = () => {
  const targetSequence = useGameState((s) => s.targetSequence) as number[];
  const currentInput = useGameState((s) => s.currentInput) as number[];

  return (
    <div className="flex flex-col items-center">
      <div className="bg-slate-900/50 backdrop-blur-sm py-2 px-2 rounded-xl border border-slate-700 shadow-2xl flex flex-col items-center">
        <div className="flex space-x-4">
          {targetSequence.map((num, idx) => {
            const isMatched = idx < currentInput.length;
            const isCurrent = idx === currentInput.length;

            return (
              <div
                key={idx}
                className={`
                                w-8 h-8  flex items-center justify-center rounded-lg text-xl font-bold border-3
                                transition-all duration-200
                                ${
                                  isMatched
                                    ? "bg-green-500 border-green-400 text-white scale-110"
                                    : isCurrent
                                      ? "bg-slate-800 border-blue-500 text-blue-400 animate-pulse"
                                      : "bg-slate-800 border-slate-600 text-slate-500"
                                }
                            `}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttackSequence;
