import { assets } from "../../config";
import { GameObject } from "../../core/GameObject";
import { Timer } from "../../core/Timer";
import { cloneAudio } from "../../utils";
import { Player } from "./Player";

interface VoidStarOptions {
  center: { x: number; y: number };
  initialAngle: number;
  onDeath: () => void;
  debugNumber?: number;
}

const SPEED = -0.1;
const DIST = 200;

export class VoidStar extends GameObject {
  private center = { x: 0, y: 0 };
  private angle = 0;
  private used = false;
  private onDeath: () => void;

  private debugNumber?: number;

  private spawning = true;
  private spawnTimer = new Timer(
    () => {
      this.spawning = false;
      this.crashAudio.play();
    },
    {
      once: true,
      delay: 1,
    }
  );
  private crashAudio = cloneAudio(assets.audio.voidstar_crash);

  private moving = false;

  private transition = false;
  private transitionTimer = new Timer(
    () => {
      this.transition = false;
      this.used = true;
      assets.audio.blackhole_spawn.play();
    },
    { once: true, delay: 1 }
  );

  constructor({ center, initialAngle, onDeath, debugNumber }: VoidStarOptions) {
    const x = center.x + DIST * Math.cos(initialAngle);
    const y = center.y + DIST * Math.sin(initialAngle);
    super(x, y, 35);

    this.center = center;
    this.angle = initialAngle;
    this.onDeath = onDeath;
    this.debugNumber = debugNumber;
  }

  update(delta: number): void {
    if (this.spawning) {
      this.spawnTimer.update(delta);
      return;
    }

    if (this.transition) {
      this.transitionTimer.update(delta);
    }

    if (this.moving) {
      this.angle += SPEED * delta;
      this.position.x = this.center.x + DIST * Math.cos(this.angle);
      this.position.y = this.center.y + DIST * Math.sin(this.angle);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.lineWidth = 2;
    ctx.fillStyle = this.used ? "rgba(0,0,0,.35)" : "rgba(65, 105, 225, 0.25)";
    ctx.strokeStyle = this.used ? "black" : "#4169E1";

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
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (this.transition) {
      const r = this.radius * this.transitionTimer.progress;
      ctx.fillStyle = "rgba(0,0,0,.35)";

      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (this.debugNumber !== undefined) {
      ctx.fillStyle = "white";
      ctx.font = "32px serif";
      ctx.fillText(
        this.debugNumber.toString(),
        this.position.x - 8,
        this.position.y + 8
      );
    }

    ctx.restore();
  }

  start() {
    this.moving = true;
  }

  consume() {
    this.transition = true;
  }

  onCollision(o: GameObject): void {
    if (o instanceof Player && this.used) {
      this.onDeath();
    }
  }
}
