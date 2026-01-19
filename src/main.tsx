import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Game, Scene } from "./core/Game.ts";
import { Encounter } from "./game/scenes/Encounter.ts";
import { GameProvider } from "./ui/GameProvider.tsx";

import "./index.css";
import { assets } from "./config.ts";

class MenuBg extends Scene {
  public render(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.drawImage(assets.images.background, 0, 0);
  }
}

const game = new Game({ width: 800, height: 600 });
const encounter = new Encounter(game);

game.addScene("menu", new MenuBg(game));
game.addScene("encounter", encounter);
game.start();

const container = document.getElementById("game-container");
container?.appendChild(game.canvas);

const uiRoot = document.createElement("div");
uiRoot.classList.add("absolute", "inset-0", "w-full", "h-full");
container?.appendChild(uiRoot);

createRoot(uiRoot).render(
  <StrictMode>
    <GameProvider game={game}>
      <App
        onPlay={() => {
          encounter.reset();
          game.changeScene("encounter");
          game.start();
        }}
      />
    </GameProvider>
  </StrictMode>
);
