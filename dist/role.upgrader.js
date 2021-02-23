'use strict';

var targeter = require('targeter');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.anchorId == null) {
            // Assign creep to an anchor
            targeter.assignRoundRobinAnchorTarget(
                creep, FIND_STRUCTURES, (structure) => (
                    structure.structureType == STRUCTURE_CONTROLLER
                )
            )
        }

        if(creep.store[RESOURCE_ENERGY] == 0) {
            if (creep.memory.building) {
                creep.say('🔄 withdraw');
            }
            creep.memory.upgrading = false;
	    }
	    
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if (creep.memory.claim != null && creep.room.name != creep.memory.claim.roomName) {
                // If we're claiming a new room, special short-circuit:
                // Once they're full of energy, book it to a new room and get busy
                creep.say('NEW ROOM!!');
                creep.moveTo(Game.rooms[creep.memory.claim.roomName].controller, {visualizePathStyle: {stroke: '#ffff00'}});
                return;
            }
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            let container = targeter.findEnergyWithdrawTarget(creep);
            if (container != null) {
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
