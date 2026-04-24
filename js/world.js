// ==========================================
// World container (Modernized 2026 ES6 Class)
// ==========================================

class World {
    // Constructor( sx, sy, sz )
    //
    // Creates a new world container with the specified world size.
    // Up and down should always be aligned with the Z-direction.
    constructor(sx, sy, sz) {
        this.sx = sx;
        this.sy = sy;
        this.sz = sz;

        // Initialise world array (3D)
        this.blocks = Array.from({ length: sx }, () =>
            Array.from({ length: sy }, () =>
                new Array(sz)
            )
        );

        this.players = {};
        this.renderer = null;
        this.spawnPoint = new Vector(0, 0, 0);
    }

    // createFlatWorld()
    //
    // Sets up the world so that the bottom half is filled with dirt
    // and the top half with air.
    createFlatWorld(height) {
        this.spawnPoint = new Vector(
            this.sx / 2 + 0.5,
            this.sy / 2 + 0.5,
            height
        );

        for (let x = 0; x < this.sx; x++) {
            for (let y = 0; y < this.sy; y++) {
                for (let z = 0; z < this.sz; z++) {
                    this.blocks[x][y][z] = z < height ? BLOCK.DIRT : BLOCK.AIR;
                }
            }
        }
    }

    // createFromString( str )
    //
    // Creates a world from a string representation.
    // This is the opposite of toNetworkString().
    createFromString(str) {
        let i = 0;

        for (let x = 0; x < this.sx; x++) {
            for (let y = 0; y < this.sy; y++) {
                for (let z = 0; z < this.sz; z++) {
                    this.blocks[x][y][z] = BLOCK.fromId(str.charCodeAt(i) - 97);
                    i++;
                }
            }
        }
    }

    // getBlock( x, y, z )
    //
    // Get the type of the block at the specified position.
    getBlock(x, y, z) {
        if (
            x < 0 || y < 0 || z < 0 ||
            x >= this.sx || y >= this.sy || z >= this.sz
        ) {
            return BLOCK.AIR;
        }
        return this.blocks[x][y][z];
    }

    // setBlock( x, y, z )
    setBlock(x, y, z, type) {
        if (
            x < 0 || y < 0 || z < 0 ||
            x >= this.sx || y >= this.sy || z >= this.sz
        ) {
            return;
        }

        this.blocks[x][y][z] = type;

        if (this.renderer) {
            this.renderer.onBlockChanged(x, y, z);
        }
    }

    // toNetworkString()
    //
    // Returns a string representation of this world.
    toNetworkString() {
        const chars = [];

        for (let x = 0; x < this.sx; x++) {
            for (let y = 0; y < this.sy; y++) {
                for (let z = 0; z < this.sz; z++) {
                    chars.push(
                        String.fromCharCode(97 + this.blocks[x][y][z].id)
                    );
                }
            }
        }

        return chars.join("");
    }
}

// ==========================================
// Node.js export helpers (unchanged behavior)
// ==========================================
if (typeof exports !== "undefined") {
    const fs = require("fs");

    World.prototype.loadFromFile = function (filename) {
        try {
            fs.lstatSync(filename);
            const data = fs.readFileSync(filename, "utf8").split(",");

            this.createFromString(data[3]);
            this.spawnPoint = new Vector(
                parseInt(data[0]),
                parseInt(data[1]),
                parseInt(data[2])
            );

            return true;
        } catch (e) {
            return false;
        }
    };

    World.prototype.saveToFile = function (filename) {
        const data =
            this.spawnPoint.x + "," +
            this.spawnPoint.y + "," +
            this.spawnPoint.z + "," +
            this.toNetworkString();

        fs.writeFileSync(filename, data);
    };

    exports.World = World;
}

if (typeof window !== "undefined") {
    window.World = World;
}

