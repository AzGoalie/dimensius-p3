import { assets } from "../../config";
import { GameObject } from "../../core/GameObject";
import { Input } from "../../core/Input";
import type { Encounter } from "../scenes/Encounter";
import { VoidStar } from "./VoidStar";

const speed = 150;
export class Player extends GameObject {
  public velocity = { x: 0, y: 0 };

  public safeFromDevour = false;
  public voidStar?: VoidStar;

  private sprite = assets.images.player;

  private initialPosition: { x: number; y: number };
  private scene: Encounter;

  private debuffTime = 2;
  private debuffTimer = 0;

  constructor(x: number, y: number, scene: Encounter) {
    super(x, y, 25);

    this.scene = scene;
    this.initialPosition = { x, y };
  }

  update(delta: number): void {
    const [dx, dy] = Input.getVector(
      "moveLeft",
      "moveRight",
      "moveUp",
      "moveDown"
    );
    this.velocity.x += dx * speed;
    this.velocity.y += dy * speed;

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;

    this.velocity.x *= 0.5;
    this.velocity.y *= 0.5;

    this.safeFromDevour = this.voidStar?.collidesWith(this) ?? false;

    this.debuffTimer = Math.max(0, this.debuffTimer - delta);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.drawImage(
      this.sprite,
      this.position.x - this.sprite.width / 4, // scaling down by 2
      this.position.y - this.sprite.height / 4,
      this.sprite.width / 2,
      this.sprite.height / 2
    );

    if (this.debuffTimer > 0) {
      const startAngle = -0.5 * Math.PI;
      const endAngle =
        startAngle + 2 * Math.PI * (this.debuffTimer / this.debuffTime);

      ctx.strokeStyle = "#00FF7F";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y - 50, 10, startAngle, endAngle);
      ctx.stroke();
    }

    ctx.restore();
  }

  onCollision(other: GameObject): void {
    if (other instanceof VoidStar) {
      this.safeFromDevour = true;
      this.voidStar = other;
    }
  }

  respawn() {
    this.voidStar = undefined;
    this.debuffTimer = 0;
    this.position.x = this.initialPosition.x;
    this.position.y = this.initialPosition.y;
  }

  debuff() {
    if (this.debuffTimer > 0) {
      this.scene.death();
    } else {
      this.debuffTimer = this.debuffTime;
    }
  }
}
