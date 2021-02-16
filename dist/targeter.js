'use strict';

module.exports = {
    findRepairTarget(creep) {
        var target;
        for (let i = 1; i <= 10; i++) {
            // Find nearest repair target by 10% hits buckets
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (
                    (10*structure.hits/structure.hitsMax) < i &&
                    (structure.hits < i*10000)
                )
            })
            if (target != null) {
                creep.memory.repairTarget = target.id;
                break;
            }
        }
        return target;
    },

    findBuildTarget(creep) {
        return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    },

    findEnergyStoreTarget(creep) {
        for (const i of [2, 5, 10]) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER
                    ) && (
                        (10*structure.store[RESOURCE_ENERGY]/structure.store.getCapacity(RESOURCE_ENERGY)) < i
                    );
                }
            });
            if (target != null) {
                break;
            }
        }
        if (target == null) {
            // container as last resort
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_STORAGE
                    ) && (
                        (structure.store.getCapacity(RESOURCE_ENERGY) - structure.store[RESOURCE_ENERGY]) > 0
                    );
                }
            });
        }
    }
}