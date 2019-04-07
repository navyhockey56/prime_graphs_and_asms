var Point = /** @class */ (function () {
    function Point(active) {
        if (active === void 0) { active = false; }
        this.active = active;
    }
    Point.prototype.setNext = function (vertex) {
        this.next = vertex;
    };
    Point.prototype.getNext = function () {
        if (!this.next)
            throw ("Doesn't have next");
        return this.next;
    };
    Point.prototype.hasNext = function () {
        return !!this.next;
    };
    Point.prototype.dup = function () {
        var p = new Point(this.active);
        if (this.hasNext())
            p.next = this.next;
        return p;
    };
    return Point;
}());
var Branch = /** @class */ (function () {
    function Branch(startingPoint, currentPoint) {
        if (currentPoint === void 0) { currentPoint = startingPoint; }
        this.startingPoint = startingPoint;
        this.currentPoint = currentPoint;
        if (!this.startingPoint)
            throw ("need starting point for Branch");
    }
    Branch.prototype.addPoint = function (point) {
        this.currentPoint.next = point;
        this.currentPoint = point;
    };
    Branch.prototype.dup = function () {
        var startingPoint = this.startingPoint.dup();
        var current = startingPoint;
        var nextPoint;
        while (current.hasNext()) {
            var next = current.next;
            nextPoint = next.dup();
            current.next = nextPoint;
            current = nextPoint;
        }
        return new Branch(startingPoint, current);
    };
    Branch.prototype.copyAndClose = function () {
        var copy = this.dup();
        copy.addPoint(copy.startingPoint);
        return new Cycle(copy.currentPoint);
    };
    Branch.prototype.length = function () {
        var count = 1;
        var current = this.startingPoint;
        while (current.hasNext()) {
            current = current.next;
            count++;
        }
        return count;
    };
    return Branch;
}());
var Cycle = /** @class */ (function () {
    function Cycle(currentPoint) {
        this.currentPoint = currentPoint;
        if (!(currentPoint instanceof Point))
            throw ('currentPoint must have a value');
        this.startingPoint = this.currentPoint;
    }
    Cycle.prototype.active = function () {
        return this.currentPoint.active;
    };
    Cycle.prototype.move = function () {
        this.currentPoint = this.currentPoint.next;
    };
    Cycle.prototype.length = function () {
        if (this._length)
            return this._length;
        var count = 1;
        var current = this.startingPoint;
        while (current.next !== this.startingPoint) {
            current = current.next;
            count++;
        }
        return this._length = count;
    };
    return Cycle;
}());
var Asm = /** @class */ (function () {
    function Asm(numActivators, numNonActivators) {
        this.numActivators = numActivators;
        this.numNonActivators = numNonActivators;
        this.cycles = [];
        this.branch = new Branch(new Point(true));
        for (var i = 1; i < this.numActivators; i++) {
            this.branch.addPoint(new Point(true));
        }
        for (var i = 0; i < this.numNonActivators; i++) {
            this.branch.addPoint(new Point());
        }
        this.cycles.push(this.branch.copyAndClose());
        this.branch.addPoint(new Point());
    }
    Asm.prototype.nextState = function () {
        this.cycles.forEach(function (c) { return c.move(); });
        if (!this.active()) {
            this.cycles.push(this.branch.copyAndClose());
        }
        this.branch.addPoint(new Point());
        return this;
    };
    Asm.prototype.runMachine = function (iterations) {
        for (var i = 1; i <= iterations; i++) {
            this.nextState();
        }
        return this;
    };
    Asm.prototype.active = function () {
        return this.cycles.some(function (c) { return c.active(); });
    };
    Asm.prototype.lengths = function () {
        return this.cycles.map(function (c) { return c.length(); });
    };
    return Asm;
}());
console.info('boot');
var a = new Asm(1, 1);
console.debug('made Asm', a);
console.debug('about to run machine');
a.runMachine(20);
console.debug('finished running machine');
console.info("Lengths: " + a.lengths());
