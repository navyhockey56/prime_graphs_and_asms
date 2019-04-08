class Point {
  public next?: Point;

  constructor(public active: boolean = false) {}

  public setNext(vertex: Point) {
    this.next = vertex;
  }

  public getNext(): Point {
    if (!this.next) { throw new Error(('Doesn\'t have next')); }
    return this.next;
  }

  public hasNext(): boolean {
    return !!this.next;
  }

  public dup(): Point {
    const p = new Point(this.active);
    if (this.hasNext()) { p.next = this.next; }
    return p;
  }
}

class Branch {
  constructor(
    private startingPoint: Point,
    private currentPoint: Point = startingPoint,
  ) {
    if (!this.startingPoint) { throw new Error(('need starting point for Branch')); }
  }

  public addPoint(point: Point) {
    this.currentPoint.next = point;
    this.currentPoint = point;
  }

  public dup() {
    const startingPoint = this.startingPoint.dup();
    let current = startingPoint;
    let nextPoint;
    while (current.hasNext()) {
      const next = current.next as Point;
      nextPoint = next.dup();
      current.next = nextPoint;
      current = nextPoint;
    }
    return new Branch(startingPoint, current);
  }

  public copyAndClose() {
    const copy = this.dup();
    copy.addPoint(copy.startingPoint);
    return new Cycle(copy.currentPoint);
  }

  public length(): number {
    let count = 1;
    let current = this.startingPoint;
    while (current.hasNext()) {
      current = current.next as Point;
      count++;
    }
    return count;
  }
}

class Cycle {
  private _length?: number;
  private startingPoint: Point;

  constructor(private currentPoint: Point) {
    if (!(currentPoint instanceof Point)) { throw new Error(('currentPoint must have a value')); }
    this.startingPoint = this.currentPoint;
  }

  public active() {
    return this.currentPoint.active;
  }

  public move() {
    this.currentPoint = this.currentPoint.next as Point;
  }

  public length(): number {
    if (this._length) { return this._length; }

    let count = 1;
    let current = this.startingPoint;
    while (current.next !== this.startingPoint) {
      current = current.next as Point;
      count++;
    }
    return this._length = count;
  }

}

class Asm {
  private cycles: Cycle[] = [];
  private branch: Branch;

  constructor(
    private numActivators: number,
    private numNonActivators: number,
  ) {
    this.branch = new Branch(new Point(true));
    for (let i = 1; i < this.numActivators; i++) {
      this.branch.addPoint(new Point(true));
    }

    for (let i = 0; i < this.numNonActivators; i++) {
      this.branch.addPoint(new Point());
    }

    this.cycles.push(this.branch.copyAndClose());
    this.branch.addPoint(new Point());
  }

  public nextState() {
    this.cycles.forEach((c) => c.move());
    const addNewCycle = !this.active();
    if (addNewCycle) {
      this.cycles.push(this.branch.copyAndClose());
    }
    this.branch.addPoint(new Point());
    return addNewCycle;
  }

  public runMachine(iterations: number) {
    for (let i = 1; i <= iterations; i++) {
      this.nextState();
    }
    return this;
  }

  public active() {
    return this.cycles.some((c) => c.active());
  }

  public lengths() {
    return this.cycles.map((c) => c.length());
  }

  public longestCycleLength() {
    return this.cycles[this.cycles.length - 1].length();
  }

  public longestCycle() {
    return this.cycles[this.cycles.length - 1];
  }

}

console.info('boot');
const a = new Asm(9, 8);
console.debug('made Asm', a);
console.debug('about to run machine');
const start = new Date();
a.runMachine(500);
const diff = new Date() as any - (start as any);
console.info(`${diff} ms`);
console.debug(`finished running machine, found ${a.longestCycleLength()}`);
// console.info(`Lengths: ${a.lengths()}`)