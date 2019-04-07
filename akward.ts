class Point {
  private _nextPoint: Point

  constructor(public active: boolean = false) {}

  public set next(vertex: Point) {
    this._nextPoint = vertex
  }

  public get next(): Point {
    return this._nextPoint
  }

  dup(): Point {
    let p = new Point(this.active)
    p.next = this.next
    return p
  }
}

class Branch {
  constructor(
    private startingPoint: Point,
    private currentPoint: Point = null
  ) {
    this.currentPoint = this.currentPoint || this.startingPoint
  }

  addPoint(point: Point) {
    this.currentPoint.next = point
    this.currentPoint = point
  }

  dup() {
    const startingPoint = this.startingPoint.dup()
    let current = startingPoint
    let nextPoint;
    while ((nextPoint = current.next.dup()) !== null) {
      current.next = nextPoint
      current = nextPoint
    }
    return new Branch(startingPoint, current)
  }

  copyAndClose() {
    const copy = this.dup()
    copy.addPoint(copy.startingPoint)
    return new Cycle(copy.currentPoint)
  }

  length() {
    let count = 1;
    let current = this.startingPoint
    while (current = current.next) {
      count++
    }
    return count
  }
}

class Cycle {
  private _length: Number
  private startingPoint: Point

  constructor(private currentPoint: Point) {
    this.startingPoint = this.currentPoint
  }

  active() {
    return this.currentPoint.active
  }

  move() {
    this.currentPoint = this.currentPoint.next
  }

  length() {
    if (this._length) return this._length

    let count = 1
    let current = this.startingPoint

    while ((current = current.next) !== this.startingPoint) {
      count++
    }
    return this._length = count
  }

}

class Asm {
  private cycles: Cycle[] = []
  private branch: Branch

  constructor(
    private numActivators: number,
    private numNonActivators: number
  ) {
    this.branch = new Branch(new Point(true))
    for (let i = 1; i < this.numActivators; i++) {
      this.branch.addPoint(new Point(true))
    }

    for (let i = 0; i < this.numNonActivators; i++){
      this.branch.addPoint(new Point())
    }

    this.cycles.push(this.branch.copyAndClose())
    this.branch.addPoint(new Point())
  }

  nextState() {
    this.cycles.forEach(c => c.move())
    if (!this.active()) {
      this.cycles.push(this.branch.copyAndClose())
    }
    this.branch.addPoint(new Point())
    return this
  }

  runMachine(iterations) {
    for (let i = 1; i <= iterations; i++) {
      this.nextState()
    }
    return this
  }

  active() {
    return this.cycles.some(c => c.active())
  }

  lengths() {
    return this.cycles.map(c => c.length())
  }

}