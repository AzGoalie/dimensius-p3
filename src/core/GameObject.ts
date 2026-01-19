export abstract class GameObject {
  position: { x: number; y: number };
  radius: number;
  tag?: string;

  constructor(x: number, y: number, radius: number) {
    this.position = { x, y };
    this.radius = radius;
  }

  update(_delta: number): void {}
  render(_ctx: CanvasRenderingContext2D): void {}

  collidesWith(other: GameObject): boolean {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;

    const dist = dx * dx + dy * dy;
    return dist < Math.pow(this.radius + other.radius, 2);
  }

  distanceTo(other: GameObject): number {
    return Math.hypot(
      this.position.x - other.position.x,
      this.position.y - other.position.y
    );
  }

  onCollision(_o: GameObject): void {}
}
