class Vertex {
  public edges: object

  constructor() {
    this.edges = {}
  }

  addEdge(key: string, point) {
    this.edges[key] = point
  }
}

class Point extends Vertex {
  private _next: Point

  constructor(multipleEdges = false) {
    if (multipleEdges) super()
    this.edges = null
  }

  next(key = null) {
    return this._next || this.edges[key]
  }

  addEdge(key = null, point) {
    if (key && this.edges) super.addEdge(key, point)
    else this._next = point
    return self
  }

  dup() {
    const point = new Point()
    if (this._next) point.next = this.next
    return point
  }
}

class Cycle {
  public currentPoint: Point
  public isComplete: boolean

  private _length: number

  constructor(public initialPoint: Point = null, cycleToCopy: Cycle = null) {
    if (initialPoint && cycleToCopy) {
      console.log("Ignoring initialPoint since cycleToCopy was passed")
    }
    this.isComplete = false

    if (cycleToCopy) {
      let _initialPoint = cycleToCopy.initialPoint
      this.initialPoint = initialPoint.edges ? initialPoint : initialPoint.dup()
      this.currentPoint = this.initialPoint

      let current = this.initialPoint
      let nextPoint;
      while (nextPoint = current.next(cycleToCopy)) {
        current = nextPoint.dup()

      }

    }
  }

  addPoint(point: Point) {
    if (this.isComplete) {
      throw('The cycle has already been closed')
    }

    this.currentPoint.addEdge(this, point)
    this.currentPoint = point
    return this
  }

  closeCycle() {
    this.addPoint(this.initialPoint)
    this.isComplete = true
    return this
  }

  length() {
    if (this._length) return this._length
    let current = this.initialPoint
    let count = 1
    let nextPoint
    while ((nextPoint = current.next()) && nextPoint != this.initialPoint) {
      count++
      current = nextPoint
    }
    if (this.isComplete) this._length = count
    return count
  }

  atStartingPoint() {
    return this.currentPoint == this.initialPoint
  }

  move(numberOfMoves = 1) {
    for (let i = 0; i < numberOfMoves; i++) {
      this.currentPoint = this.currentPoint.next(self)
    }
    return this
  }

  position() {
    let position = 0
    let current = this.initialPoint
    while (current != this.currentPoint) {
      position++
      current = current.next(this)
    }
    return position
  }

  eq(cycle: Cycle) {
    return cycle && cycle instanceof Cycle && (cycle.isComplete == this.isComplete) && cycle.length() == this.length()
  }

  static add(cycle1: Cycle, cycle2: Cycle) {
    if (!(cycle1.isComplete && cycle2.isComplete)) {
      throw ('Cycle is not closed')
    }
    if (!(cycle1.length() == cycle2.length())) {
      throw ('Incompatible cycle lengths')
    }

    let cycle = new Cycle(null, cycle1)
    cycle.closeCycle()

    let current = cycle1.initialPoint
    while (current != cycle1.initialPoint) {
      current = current.next()
      cycle.move()
    }

    current = cycle2.initialPoint
    while (current != cycle2.currentPoint) {
      current = current.next()
      cycle.move()
    }

    return cycle
  }

}

class CycleGraph {
  public cycles: Cycle[] = []

  constructor(cycles: Cycle[]) {
    if (cycles && cycles instanceof Array) {
      this.cycles = cycles.sort((a, b) => a.length() - b.length())
    }
  }

  move(numberOfMoves = 1) {
    for (let i = 0; i < numberOfMoves; i++) {
      this.cycles.forEach(c => c.move())
    }
    return this
  }

  eq(cycleGraph: CycleGraph) {
    return cycleGraph && cycleGraph instanceof CycleGraph && (this.cycles.map(c => c.length()) == cycleGraph.cycles.map(c => c.length()))
  }

  static add(cycle1: CycleGraph, cycle2: CycleGraph) {
    if (cycle1.cycles.length != cycle2.cycles.length) {
      throw('Incompatible cycle lengths')
    }
    let cycles = []

    for (let i = 0; i < cycle1.cycles.length; i++) {
      cycles.push(Cycle.add(cycle1.atIndex(i), cycle2.atIndex(i)))
    }
    return new CycleGraph(cycles)
  }

  atIndex(i: number) {
    return this.cycles[i]
  }

  position() {
    return this.cycles.map(c => c.position())
  }

  fullyActive() {
    return this.cycles.every(c => c.atStartingPoint())
  }

  active() {
    return this.cycles.length > 0 && this.cycles.some(c => c.atStartingPoint())
  }
}

class PrimeGraph extends CycleGraph {
  public cycles: Cycle[]
  public initialPoint = new Point()
  public unfinishedCycle = new Cycle(this.initialPoint)
  public iteration = 1

  constructor() {
    super([])
    this.unfinishedCycle.addPoint(new Point())
  }

  runMachine(numberOfIterations) {
    this.iteration += numberOfIterations
    while ((numberOfIterations -= 1) >= 0) {
      console.log(`Iterations left: ${numberOfIterations}`)
      this.move()
      if (!this.active) {
        this.unfinishedCycle.closeCycle()
        this.cycles.push(this.unfinishedCycle)
        this.unfinishedCycle = new Cycle(null, this.unfinishedCycle)
      }
      this.unfinishedCycle.addPoint(new Point())
    }
    return this
  }

  prime() {
    return this.cycles.map(c => c.length())
  }
}