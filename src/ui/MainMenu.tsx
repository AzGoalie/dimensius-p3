import { Play } from "lucide-react";

interface Props {
  onPlay: () => void;
}

const MainMenu = ({ onPlay }: Props) => (
  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
    <div className="bg-slate-900 p-8 rounded-2xl border border-blue-500/30 shadow-2xl text-center max-w-md">
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-6">
        Dimensius P3
      </h1>
      <p className="text-slate-300 mb-6 leading-relaxed">
        <span className="text-blue-400 font-bold">WASD/Arrows</span> to move.
        <br />
        <span className="text-yellow-400 font-bold">1-2-3</span> to attack.
        <br />
        Avoid getting two stacks from the{" "}
        <span className="text-purple-500 font-bold">rings</span>.
        <br />
        Hide in <span className="text-cyan-400 font-bold">Blue Orbs</span> when
        he casts devour and dodge the{" "}
        <span className="text-blue-800 font-bold">Black Holes</span>.
      </p>
      <button
        onClick={onPlay}
        className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
      >
        <Play className="fill-current" /> START GAME
      </button>
    </div>
  </div>
);

export default MainMenu;
