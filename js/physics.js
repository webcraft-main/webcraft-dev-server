// ==========================================
// Physics (World Simulation) — Modernized 2026-Compatible
// ==========================================

import { BLOCK } from "./blocks.js";

export class Physics {
    constructor() {
        this.lastStep = -1;
        this.world = null;
    }

    // Assign world reference
    setWorld(world) {
        this.world = world;
    }

    // Run one physics tick (called ~1/sec)
    simulate() {
        const world = this.world;
        if (!world) return;

        const blocks = world.blocks;

        // Step counter (every 100ms)
        const step = Math.floor(Date.now() / 100);
        if (step === this.lastStep) return;
        this.lastStep = step;

        // ==========================================
        // Gravity (every step)
        // ==========================================
        if (step % 1 === 0) {
            for (let x = 0; x < world.sx; x++) {
                for (let y = 0; y < world.sy; y++) {
                    for (let z = 0; z < world.sz; z++) {
                        const block = blocks[x][y][z];

                        if (block.gravity && z > 0 && blocks[x][y][z - 1] === BLOCK.AIR) {
                            world.setBlock(x, y, z - 1, block);
                            world.setBlock(x, y, z, BLOCK.AIR);
                        }
                    }
                }
            }
        }

        // ==========================================
        // Fluid Spread (every 10 steps)
        // ==========================================
        if (step % 10 === 0) {
            const newFluidBlocks = {};

            for (let x = 0; x < world.sx; x++) {
                for (let y = 0; y < world.sy; y++) {
                    for (let z = 0; z < world.sz; z++) {
                        const material = blocks[x][y][z];

                        if (material.fluid && !newFluidBlocks[`${x},${y},${z}`]) {

                            // Left
                            if (x > 0 && blocks[x - 1][y][z] === BLOCK.AIR) {
                                world.setBlock(x - 1, y, z, material);
                                newFluidBlocks[`${x - 1},${y},${z}`] = true;
                            }

                            // Right
                            if (x < world.sx - 1 && blocks[x + 1][y][z] === BLOCK.AIR) {
                                world.setBlock(x + 1, y, z, material);
                                newFluidBlocks[`${x + 1},${y},${z}`] = true;
                            }

                            // Forward
                            if (y > 0 && blocks[x][y - 1][z] === BLOCK.AIR) {
                                world.setBlock(x, y - 1, z, material);
                                newFluidBlocks[`${x},${y - 1},${z}`] = true;
                            }

                            // Back
                            if (y < world.sy - 1 && blocks[x][y + 1][z] === BLOCK.AIR) {
                                world.setBlock(x, y + 1, z, material);
                                newFluidBlocks[`${x},${y + 1},${z}`] = true;
                            }
                        }
                    }
                }
            }
        }
    }
}

// Node.js export
if (typeof exports !== "undefined") {
    exports.Physics = Physics;
}
