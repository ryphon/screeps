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
        let target;
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (
                structure.structureType == STRUCTURE_SPAWN &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            )
        });
        if (target == null) {
            // Look at the nearest link first, check if it has capacity and is a push link
            target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => (structure.structureType == STRUCTURE_LINK)
            });
            if (target != null && (!Memory.structures[target.id].push || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0)) {
                target = null;
            }
        }
        if (target == null) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_EXTENSION &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            });
        }
        if (target == null) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_TOWER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            });
        }
        if (target == null) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_STORAGE &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            });
        }
        if (target == null) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            });
        }
        return target;
    },

    findEnergyLinkWithdrawTarget(creep) {
        let link = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => (
                structure.structureType == STRUCTURE_LINK
            )
        });
        if (!Memory.structures[link.id].push && link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            return link;
        }
        return null;
    },

    findEnergyWithdrawTarget(creep) {
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (
                structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            )
        });
        if (container == null) {
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_STORAGE &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                )
            });
        }
        return container;
    }
}
