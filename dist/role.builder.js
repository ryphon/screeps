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
            if (creep.memory.building) {
                creep.say('🔄 withdraw');
            }
            creep.memory.building = false;
	    } else if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
            var target = targeter.findBuildTarget(creep);
            if(target != null) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                target = targeter.findRepairTarget(creep);
                if (target != null) {
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    creep.say('Going home');
                    target = Game.getObjectById(creep.memory.anchorId);
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
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
