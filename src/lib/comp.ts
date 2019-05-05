import { Point, Shape } from './shape';

class Layer {
  public origin: Point = [0, 0];
  public ctx?: CanvasRenderingContext2D;

  constructor(
    public shapes: Shape[],
  ) { }

  public get canvas(): HTMLCanvasElement | undefined {
    if (!this.ctx) { return; }
    return this.ctx.canvas;
  }

  public set canvas(canvas: HTMLCanvasElement | undefined) {
    if (!canvas) { return; }
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public render(ctx: CanvasRenderingContext2D | undefined = this.ctx) {
    if (!ctx) { throw Error('Can\'t render with no CanvasRenderingContext2D'); }
    this.shapes.forEach((s) => {
      s.render(ctx, this.origin);
    });
  }
}

class Comp {
  public layers: Layer[] = [];

  constructor(public mountPoint: HTMLElement) { }

  public pushLayer(layer: Layer, canvas?: HTMLCanvasElement): void {
    if (!canvas) {
      canvas = document.createElement('canvas') as HTMLCanvasElement;
    }

    const firstCanvas = this.mountPoint.firstChild;
    if (firstCanvas) {
      this.mountPoint.insertBefore(firstCanvas, canvas);
    } else {
      this.mountPoint.appendChild(canvas);
    }

    layer.canvas = canvas;
  }

  public popLayer(): void {
    const firstCanvas = this.mountPoint.firstChild;
    if (firstCanvas) {
      this.mountPoint.removeChild(firstCanvas)
    } else {
      throw Error('No Layers, cannot pop Layer')
    }
    this.layers.pop()
  }

  render() {
    this.layers.forEach((l) => {
      l.render()
    })
  }

}
