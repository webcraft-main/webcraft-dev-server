// blocks.js — dual‑mode (browser + Node)

// -----------------------------
// INTERNAL REGISTRY
// -----------------------------
const BLOCK = {};
const DIRECTION = Object.freeze({
    UP: 1,
    DOWN: 2,
    NORTH: 3,
    SOUTH: 4,
    WEST: 5,
    EAST: 6
});

// Helper to register blocks
function defineBlock(name, data) {
    BLOCK[name] = {
        id: data.id,
        spawnable: data.spawnable ?? true,
        transparent: data.transparent ?? false,
        selflit: data.selflit ?? false,
        gravity: data.gravity ?? false,
        fluid: data.fluid ?? false,
        texture: data.texture ?? (() => [0, 0, 1, 1])
    };
}

// -----------------------------
// BLOCK DEFINITIONS (YOUR CODE)
// -----------------------------

// Air
defineBlock("AIR", {
    id: 0,
    spawnable: false,
    transparent: true
});

// Bedrock
defineBlock("BEDROCK", {
    id: 1,
    spawnable: false,
    transparent: false,
    texture: () => [1/16, 1/16, 2/16, 2/16]
});

// Dirt
defineBlock("DIRT", {
    id: 2,
    transparent: false,
    texture: (world, lightmap, lit, x, y, z, dir) => {
        if (dir === DIRECTION.UP && lit)
            return [14/16, 0/16, 15/16, 1/16];
        if (dir === DIRECTION.DOWN || !lit)
            return [2/16, 0/16, 3/16, 1/16];
        return [3/16, 0/16, 4/16, 1/16];
    }
});

// Wood
defineBlock("WOOD", {
    id: 3,
    texture: (world, lightmap, lit, x, y, z, dir) => {
        if (dir === DIRECTION.UP || dir === DIRECTION.DOWN)
            return [5/16, 1/16, 6/16, 2/16];
        return [4/16, 1/16, 5/16, 2/16];
    }
});

// TNT
defineBlock("TNT", {
    id: 4,
    texture: (world, lightmap, lit, x, y, z, dir) => {
        if (dir === DIRECTION.UP || dir === DIRECTION.DOWN)
            return [10/16, 0/16, 11/16, 1/16];
        return [8/16, 0/16, 9/16, 1/16];
    }
});

// Bookcase
defineBlock("BOOKCASE", {
    id: 5,
    texture: (world, lightmap, lit, x, y, z, dir) => {
        if (dir === DIRECTION.NORTH || dir === DIRECTION.SOUTH)
            return [3/16, 2/16, 4/16, 3/16];
        return [4/16, 0/16, 5/16, 1/16];
    }
});

// Lava
defineBlock("LAVA", {
    id: 6,
    spawnable: false,
    transparent: true,
    selflit: true,
    gravity: true,
    fluid: true,
    texture: () => [13/16, 14/16, 14/16, 15/16]
});

// Plank
defineBlock("PLANK", {
    id: 7,
    texture: () => [4/16, 0/16, 5/16, 1/16]
});

// Cobblestone
defineBlock("COBBLESTONE", {
    id: 8,
    texture: () => [0/16, 1/16, 1/16, 2/16]
});

// Concrete
defineBlock("CONCRETE", {
    id: 9,
    texture: () => [1/16, 0/16, 2/16, 1/16]
});

// Brick
defineBlock("BRICK", {
    id: 10,
    texture: () => [7/16, 0/16, 8/16, 1/16]
});

// Sand
defineBlock("SAND", {
    id: 11,
    gravity: true,
    texture: () => [2/16, 1/16, 3/16, 2/16]
});

// Gravel
defineBlock("GRAVEL", {
    id: 12,
    gravity: true,
    texture: () => [3/16, 1/16, 4/16, 2/16]
});

// Iron
defineBlock("IRON", {
    id: 13,
    texture: () => [6/16, 1/16, 7/16, 2/16]
});

// Gold
defineBlock("GOLD", {
    id: 14,
    texture: () => [7/16, 1/16, 8/16, 2/16]
});

// Diamond
defineBlock("DIAMOND", {
    id: 15,
    texture: () => [8/16, 1/16, 9/16, 2/16]
});

// Obsidian
defineBlock("OBSIDIAN", {
    id: 16,
    texture: () => [5/16, 2/16, 6/16, 3/16]
});

// Glass
defineBlock("GLASS", {
    id: 17,
    transparent: true,
    texture: () => [1/16, 3/16, 2/16, 4/16]
});

// Sponge
defineBlock("SPONGE", {
    id: 18,
    texture: () => [0/16, 3/16, 1/16, 4/16]
});

// -----------------------------
// EXPORTS (dual‑mode)
// -----------------------------
if (typeof window !== "undefined") {
    window.BLOCK = BLOCK;
    window.DIRECTION = DIRECTION;
}

if (typeof exports !== "undefined") {
    exports.BLOCK = BLOCK;
    exports.DIRECTION = DIRECTION;
}
