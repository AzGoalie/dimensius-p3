import { assets } from "../../config";
import type { Scene } from "../../core/Game";
import { GameObject } from "../../core/GameObject";
import { Timer } from "../../core/Timer";
import { Player } from "./Player";

export class TankPull extends GameObject {
  private player: Player;
  private speed = 150;
  private timer: Timer;

  private spawnTimer = new Timer(
    () => {
      this.spawning = false;
      assets.audio.tank_pull.play();
    },
    { delay: 2 }
  );
  private spawning = true;
  private scene: Scene;

  constructor(x: number, y: number, player: Player, scene: Scene) {
    super(x, y, 25);
    this.player = player;

    this.scene = scene;

    this.timer = new Timer(
      () => {
        scene.remove(this);
      },
      { once: true, delay: 2 }
    );
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(0, 229, 255, 0.25)";
    ctx.strokeStyle = "#00E5FF";

    ctx.beginPath();
    ctx.moveTo(this.player.position.x, this.player.position.y);
    ctx.lineTo(this.position.x, this.position.y);
    ctx.stroke();

    if (this.spawning) {
      const r = this.radius * this.spawnTimer.progress;

      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      return;
    }

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  update(delta: number): void {
    if (this.spawning) {
      this.spawnTimer.update(delta);
      return;
    }

    this.timer.update(delta);
    const x = this.position.x - this.player.position.x - this.player.radius;
    const y = this.position.y - this.player.position.y - this.player.radius;
    const dist = Math.hypot(x, y);

    if (dist > 0) {
      this.player.velocity.x += (x / dist) * this.speed;
      this.player.velocity.y += (y / dist) * this.speed;
    }
  }

  onCollision(o: GameObject): void {
    if (o instanceof Player && !this.spawning) {
      this.scene.remove(this);
    }
  }
}
