module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.store[RESOURCE_ENERGY] == 0) {
            if (!creep.memory.harvesting) {
                creep.say('🔄 harvest');
            }
            creep.memory.harvesting = true;
        } else if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('store');
        }

        if(creep.memory.harvesting) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            creep.memory.harvesting = false;
            var targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER
                        ) && (
                            (structure.store.getCapacity(RESOURCE_ENERGY) - structure.store[RESOURCE_ENERGY]) > 0
                        );
                    }
            });
            var cur = 1;
            var bestTarget;
            for(let target of targets) {
                var used = target.store[RESOURCE_ENERGY];
                var cap = target.store.getCapacity(RESOURCE_ENERGY);
                var pct = used / cap;
                if (pct < cur) {
                    cur = pct;
                    bestTarget = target;
                }
            }
            if (bestTarget == null) {
                // container as last resort
                bestTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
                });
            }
            if (bestTarget == null) {
                // If all else fails, go home
                bestTarget = Game.spawns["Spawn1"];
            }
            if(creep.transfer(bestTarget, RESOURCE_ENERGY) != OK || (creep.store.getFreeCapacity() == 0)) {
                creep.moveTo(bestTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};
