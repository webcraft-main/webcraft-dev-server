// ==========================================
// Helpers (Modernized 2026-Compatible)
// ==========================================

// ==========================================
// Vector class
// ==========================================

export class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    sub(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    mul(n) {
        return new Vector(this.x * n, this.y * n, this.z * n);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    distance(vec) {
        return this.sub(vec).length();
    }

    normal() {
        const len = this.length();
        if (len === 0) return new Vector(0, 0, 0);
        return new Vector(this.x / len, this.y / len, this.z / len);
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    toArray() {
        return [this.x, this.y, this.z];
    }

    toString() {
        return `( ${this.x}, ${this.y}, ${this.z} )`;
    }
}

// ==========================================
// Collision helpers
// ==========================================

// lineRectCollide(line, rect)
// line = { y, x1, x2 } OR { x, y1, y2 }
// rect = { x, y, size }

export function lineRectCollide(line, rect) {
    if (line.y != null) {
        return (
            rect.y > line.y - rect.size / 2 &&
            rect.y < line.y + rect.size / 2 &&
            rect.x > line.x1 - rect.size / 2 &&
            rect.x < line.x2 + rect.size / 2
        );
    }

    return (
        rect.x > line.x - rect.size / 2 &&
        rect.x < line.x + rect.size / 2 &&
        rect.y > line.y1 - rect.size / 2 &&
        rect.y < line.y2 + rect.size / 2
    );
}

// rectRectCollide(r1, r2)
// r1, r2 = { x1, y1, x2, y2 }

export function rectRectCollide(r1, r2) {
    return (
        (r2.x1 > r1.x1 && r2.x1 < r1.x2 && r2.y1 > r1.y1 && r2.y1 < r1.y2) ||
        (r2.x2 > r1.x1 && r2.x2 < r1.x2 && r2.y1 > r1.y1 && r2.y1 < r1.y2) ||
        (r2.x2 > r1.x1 && r2.x2 < r1.x2 && r2.y2 > r1.y1 && r2.y2 < r1.y2) ||
        (r2.x1 > r1.x1 && r2.x1 < r1.x2 && r2.y2 > r1.y1 && r2.y2 < r1.y2)
    );
}

// ==========================================
// Node.js export (for server.js)
// ==========================================
if (typeof exports !== "undefined") {
    exports.Vector = Vector;
    exports.lineRectCollide = lineRectCollide;
    exports.rectRectCollide = rectRectCollide;
}
