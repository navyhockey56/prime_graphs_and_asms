export type Point = number[];

export interface Pathlike {
  // Line styles
  lineWidth: number;
  lineCap: 'butt' | 'round' | 'square';
  lineJoin: 'round' | 'bevel' | 'miter';
  miterLimit: number;

  // Fill and stroke styles
  fillStyle: string;
  strokeStyle: string;

  // Drawing paths
  // fill(): void;
  // stroke(): void;
  // drawFocusIfNeeded(): void;
  // scrollPathIntoView(): void;
  // clip(): void;
  // isPointInPath(): boolean;
  // isPointInStroke(): boolean;
}

export class Shape implements Pathlike {
  public stroke: boolean = false;

  public lineWidth: number = 1.0;
  public lineCap: 'butt' | 'round' | 'square' = 'butt';
  public lineJoin: 'round' | 'bevel' | 'miter' = 'miter';
  public miterLimit: number = 10;

  public fillStyle: string = '#000';
  public strokeStyle: string = '#000';

  constructor(
    public origin: number[],
    public paths: Path2D[] = [],
  ) {
  }

  public render(ctx: CanvasRenderingContext2D, offset: Point) {
    ctx.translate(0, 0);
    ctx.translate(offset[0], offset[1]);

    if (this.stroke) {
      this.paths.forEach((p) => {
        ctx.stroke(p);
      });
    } else {
      this.paths.forEach((p) => {
        ctx.fill(p);
      });
    }

    ctx.translate(0, 0);
  }

}


