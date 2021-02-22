'use strict';

var targeter = require('targeter');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.anchorId == null) {
            // Assign creep to an anchor
            targeter.assignRoundRobinAnchorTarget(
                creep, FIND_MY_STRUCTURES, (structure) => (
                    structure.structureType == STRUCTURE_SPAWN
                )
            )
        }

	    if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 withdraw');
	    } else if(!creep.memory.repair && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairTarget = null;
	        creep.memory.repairing = true;
	        creep.say('🚧 repair');
	    }

	    if(creep.memory.repairing) {
            if (creep.memory.repairTarget != null) {
                target = Game.getObjectById(creep.memory.repairTarget);
                if (target != null) {
                    creep.memory.repairTarget = target.id;
                    if (target.hits == target.hitsMax) {
                        target = null;
                        creep.memory.repairTarget = null;
                    }
                }
            }
            if (target == null) {
                var target = targeter.findRepairTarget(creep);
            }
            if (target != null) {
                if(creep.repair(target) == ERR_NOT_IN_RANGE || (creep.store.getFreeCapacity() == 0)) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#0fffff'}});
                }
            } else {
                // If all else fails, go home
                creep.say('Going home');
                target = Game.getObjectById(creep.memory.anchorId);
                creep.moveTo(target, {visualizePathStyle: {stroke: '#0fffff'}});
            }
        } else {
            let container = targeter.findEnergyWithdrawTarget(creep);
            if(container != null) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
	}
};