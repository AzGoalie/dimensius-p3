import { Game, Scene } from "../../core/Game";
import { Input } from "../../core/Input";

export class TestScene extends Scene {
  private player = {
    radius: 50,
    speed: 100,
    position: { x: this.width / 2, y: this.height / 2 },
    velocity: { x: 0, y: 0 },
  };

  constructor(game: Game) {
    super(game);
  }

  public onEnter(): void {}

  public onExit(): void {}

  public update(deltaTime: number): void {
    let dx = 0;
    let dy = 0;

    if (Input.isDown("KeyW")) dy -= 1;
    if (Input.isDown("KeyS")) dy += 1;
    if (Input.isDown("KeyA")) dx -= 1;
    if (Input.isDown("KeyD")) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    this.player.velocity.x += dx * this.player.speed;
    this.player.velocity.y += dy * this.player.speed;

    this.player.position.x += this.player.velocity.x * deltaTime;
    this.player.position.y += this.player.velocity.y * deltaTime;

    this.player.velocity.x *= 0.85;
    this.player.velocity.y *= 0.85;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const {
      position: { x, y },
      radius,
    } = this.player;

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2, this.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width, this.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  }
}
