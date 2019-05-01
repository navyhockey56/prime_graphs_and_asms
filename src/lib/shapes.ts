export type Point = number[];

export abstract class Shape {
  constructor(public origin: number[]) { }

  get x() { return this.origin[0]; }
  set x(value: number) { this.origin[0] = value; }
  get y() { return this.origin[1]; }
  set y(value: number) { this.origin[1] = value; }

  public render(ctx: CanvasRenderingContext2D, offset: Point) { }
}

export class Rect extends Shape {
  constructor(public origin: Point, public width: number, public height: number) {
    super(origin);
  }

  public fill(ctx: CanvasRenderingContext2D, offset: Point = [0, 0] ): void {
    ctx.fillRect(
      this.x + offset[0],
      this.y + offset[1],
      this.width,
      this.height,
    );
  }

  public clear(ctx: CanvasRenderingContext2D, offset: Point = [0, 0]) {
    ctx.clearRect(
      this.x + offset[0],
      this.y + offset[1],
      this.width,
      this.height,
    );
  }

  public stroke(ctx: CanvasRenderingContext2D, offset: Point = [0, 0]) {
    ctx.strokeRect(
      this.x + offset[0],
      this.y + offset[1],
      this.width,
      this.height,
    );
  }

  public render(ctx: CanvasRenderingContext2D, offset: Point = [0, 0]) {
    this.fill(ctx, offset);
  }
}

export class Circle extends Shape {
  constructor(public origin: Point, public radius: number, public startAngle: number, public endAngle: number) {
    super(origin);
  }

  public fill(ctx: CanvasRenderingContext2D, offset: Point = [0, 0] ): void {
    ctx.beginPath();
    ctx.arc(this.x + offset[0], this.y + offset[1], this.radius, this.startAngle, this.endAngle);
    ctx.fill();
  }

  public clear(ctx: CanvasRenderingContext2D, offset: Point = [0, 0]) {
    ctx.clearRect(
      this.x + offset[0] - this.radius,
      this.y + offset[1] - this.radius,
      this.radius * 2,
      this.radius * 2,
    );
  }

  public stroke(ctx: CanvasRenderingContext2D, offset: Point = [0, 0]) {
    ctx.beginPath();
    ctx.arc(this.x + offset[0], this.y + offset[1], this.radius, this.startAngle, this.endAngle);
    ctx.stroke();
  }

  public render(ctx: CanvasRenderingContext2D, offset: Point = [0, 0]) {
    this.fill(ctx, offset);
  }
}

