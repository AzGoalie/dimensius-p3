export class ProgressBar {
  public value: number;
  private max: number;

  private width: number;
  private height: number;

  private fillStyle = "#4CAF50";

  constructor(
    initialValue: number,
    maxValue: number,
    width: number,
    height: number
  ) {
    this.width = width;
    this.height = height;

    this.value = initialValue;
    this.max = maxValue;
  }

  render(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.5)";
    ctx.fillRect(x - this.width / 2, y, this.width, 10);

    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(
      x - this.width / 2,
      y,
      (this.width * this.value) / this.max,
      10
    );

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - this.width / 2, y, this.width, this.height);
    ctx.restore();
  }
}
