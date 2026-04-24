// helpers.js — dual‑mode (browser + Node)

// Remove "export" — just define the class normally
class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    multiply(s) {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }
}

// Make Vector available in browser
if (typeof window !== "undefined") {
    window.Vector = Vector;
}

// Make Vector available in Node.js
if (typeof exports !== "undefined") {
    exports.Vector = Vector;
}

