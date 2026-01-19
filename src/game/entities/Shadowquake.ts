import { assets } from "../../config";
import { GameObject } from "../../core/GameObject";
import { Timer } from "../../core/Timer";
import { cloneAudio } from "../../utils";
import { Player } from "./Player";

const MAX_RADIUS = 500;
const SPAWN_RADIUS = 30;

export class Shadowquake extends GameObject {
  private center: { x: number; y: number };

  private spawning = true;
  private spawnTimer = new Timer(
    () => {
      this.spawning = false;
      this.castSound.play();
    },
    { delay: 2 }
  );

  private hit = false;

  private castSound = cloneAudio(assets.audio.shadowquake_cast);

  constructor(x: number, y: number, center: { x: number; y: number }) {
    super(x, y, 0);
    this.center = center;
  }

  update(delta: number): void {
    if (this.spawning) {
      this.spawnTimer.update(delta);

      return;
    }

    if (this.radius < MAX_RADIUS) {
      if (delta < 0) {
        console.log(delta);
      }
      this.radius += 100 * delta;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = "rgba(138, 43, 226, 0.25)";
    ctx.strokeStyle = "#8A2BE2";
    ctx.lineWidth = 2;

    if (this.spawning) {
      const r = SPAWN_RADIUS * this.spawnTimer.progress;

      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, 300, 0, Math.PI * 2);
    ctx.clip();

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  onCollision(o: GameObject): void {
    if (o instanceof Player && !this.hit) {
      this.hit = true;
      o.debuff();
    }
  }
}
