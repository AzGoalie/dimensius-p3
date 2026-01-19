import { assets } from "../../config";
import { GameObject } from "../../core/GameObject";
import { Timer } from "../../core/Timer";
import type { Player } from "./Player";

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  inward: number;
}
const particleCount = 400;

export class Devour extends GameObject {
  private particles: Particle[] = [];
  private center: { x: number; y: number };
  private player: Player;
  private speed = 75;

  private maxSpeed = 400;

  private timer = new Timer(
    () => {
      this.speed = this.maxSpeed;
      assets.audio.devour_explode.play();
    },
    {
      once: true,
      delay: 5,
    }
  );

  constructor(
    center: { x: number; y: number },
    player: Player,
    onEnd: () => void
  ) {
    super(center.x, center.y, 50);

    this.center = center;
    this.player = player;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 300;
      this.particles.push({
        angle,
        radius,
        speed: Math.random() * 0.75 + 0.25,
        inward: Math.random() * 250 + 100,
      });
    }

    assets.audio.devour_loop.play();
    assets.audio.devour_loop.onended = onEnd;
  }

  update(delta: number): void {
    this.timer.update(delta);

    for (const p of this.particles) {
      p.angle += p.speed * delta;
      p.radius -= p.inward * delta;
      if (p.radius < 0) {
        p.radius = Math.random() * 300;
      }
    }

    if (!this.player.safeFromDevour) {
      const x = this.center.x - this.player.position.x - this.player.radius;
      const y = this.center.y - this.player.position.y - this.player.radius;
      const dist = Math.hypot(x, y);

      if (dist > 0) {
        this.player.velocity.x += (x / dist) * this.speed;
        this.player.velocity.y += (y / dist) * this.speed;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, 300, 0, Math.PI * 2);
    ctx.fill();

    for (const p of this.particles) {
      const x = this.center.x + Math.cos(p.angle) * p.radius;
      const y = this.center.y + Math.sin(p.angle) * p.radius;

      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(x, y, 0.75, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
