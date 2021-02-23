'use strict';

module.exports = {
    cleanAnchorMemory: function(creepName, anchorId) {
        console.log("Cleaning up anchor memory for " + creepName);
        const anchor = Memory.anchors[anchorId];
        if (anchor != null && anchor.creeps != null) {
            const idx = anchor.creeps.indexOf(creepName);
            if (idx !== -1) {
                anchor.creeps.splice(idx, 1);
            }
        }
    },

    assignRoundRobinAnchorTarget(creep, findType, filterFunc) {
        // Assign creep an anchor object
        // Init anchors memory as needed
        if (Memory.anchors == null) {
            console.log("Initializing anchors memory");
            Memory.anchors = {};
        }
        // Find valid targets
        const targets = creep.room.find(findType, {
            filter: filterFunc
        });
        // Initialize anchor memory for targets
        for (const target of targets) {
            if (Memory.anchors[target.id] == null) {
                Memory.anchors[target.id] = {'creeps': []}
            }
        }
        // Find least assigned anchor target
        const minTarget = targets.reduce((res, target) =>
            (Memory.anchors[target.id].creeps.length < Memory.anchors[res.id].creeps.length) ? target : res
        );
        // Assign creep to that target
        Memory.anchors[minTarget.id].creeps.push(creep.name);
        creep.memory.anchorId = minTarget.id;
        console.log(creep.name + " assigned to anchor " + minTarget);
        // One last memory management item
        for (const objId in Memory.anchors) {
            if (Game.getObjectById(objId) == null) {
                console.log('Cleaning up anchor memory for obj:' + objId);
                delete Memory.anchors[objId]
            }
        }
    },

    findRepairTarget(creep) {
        var target;
        if (creep.room.memory.wallHitsGoal == null) {
            creep.room.memory.wallHitsGoal = Memory.wallHitsGoal;
        }
        const hitsBucketCount = 10;
        const hitsBucketSize = creep.room.memory.wallHitsGoal / hitsBucketCount;
        for (let i = 1; i <= hitsBucketCount; i++) {
            // Find nearest repair target by 10% hits buckets
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (
                    (10*structure.hits/structure.hitsMax) < i &&
                    (structure.hits < i*hitsBucketSize)
                )
            })
            if (target != null) {
                break;
                break;
            }
        }
        return target;
    },

    findBuildTarget(creep) {
        return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    },

    findEnergyStoreTarget(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (
                structure.structureType == STRUCTURE_TOWER &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > structure.store.getUsedCapacity(RESOURCE_ENERGY)
            )
        });
        // Only look at the nearest link to their anchor, check if it has capacity and is a push link
        if (target == null) {
            if (creep.memory.anchorId != null) {
                target = Game.getObjectById(creep.memory.anchorId).pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => (structure.structureType == STRUCTURE_LINK)
                });
                if (target != null && (!Memory.structures[target.id].push || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0)) {
                    target = null;
                }
            }
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
                    structure.structureType == STRUCTURE_EXTENSION &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            });
        }
        if (target == null) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_SPAWN &&
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

    findEnergyStoreTargetInRange(creep, range) {
        let target;
        let anchor = Game.getObjectById(creep.memory.anchorId);
        let inRange = anchor.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (structure) => structure.store != null
        });
        target = creep.pos.findClosestByPath(inRange, {
            filter: (structure) => (
                structure.structureType == STRUCTURE_TOWER &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 100
            )
        }, inRange);
        if (target == null) {
            // Only look at the nearest link to their anchor, check if it has capacity and is a push link
            if (creep.memory.anchorId != null) {
                target = Game.getObjectById(creep.memory.anchorId).pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => (structure.structureType == STRUCTURE_LINK)
                });
                if (target != null && (!Memory.structures[target.id].push || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0)) {
                    target = null;
                }
            }
        }
        if (target == null) {
            target = creep.pos.findClosestByPath(inRange, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_SPAWN &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            }, inRange);
        }
        if (target == null) {
            target = creep.pos.findClosestByPath(inRange, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_EXTENSION &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            }, inRange);
        }
        if (target == null) {
            target = creep.pos.findClosestByPath(inRange, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_STORAGE &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            }, inRange);
        }
        if (target == null) {
            target = creep.pos.findClosestByPath(inRange, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            }, inRange);
        }
        if (target != null) {
        }
        return target;
    },

    findEnergyLinkWithdrawTarget(creep) {
        if (creep.memory.anchorId != null) {
            let link = Game.getObjectById(creep.memory.anchorId).pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_LINK
                )
            });
            if (link != null && !Memory.structures[link.id].push && link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                return link;
            }
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
