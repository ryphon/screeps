'use strict';
var targeter = require('targeter');

module.exports = {
    /*
    */
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.anchorId == null) {
            // Assign creep to a source
            targeter.assignRoundRobinAnchorTarget(
                creep, FIND_STRUCTURES, (structure) => (
                    structure.structureType == STRUCTURE_STORAGE ||
                    structure.structureType == STRUCTURE_CONTAINER
            ));
        }

        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            if (creep.memory.distributing) {
                creep.say('⛽ charge');
            }
            creep.memory.distributing = false;
        }
        if(!creep.memory.distributing && creep.store.getFreeCapacity() == 0) {
            creep.memory.distributing = true;
            creep.say('♲ distribute');
        }

        if(!creep.memory.distributing) {
            const link = targeter.findEnergyLinkWithdrawTarget(creep);
            if (link != null && creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(link, {visualizePathStyle: {stroke: '#ffaa00'}});
                return;
            }
            let target = targeter.findEnergyWithdrawTarget(creep);
            if (target == null) {
                creep.say('Going home');
                target = Game.getObjectById(creep.memory.anchorId);
            }
            if (creep.withdraw(target, RESOURCE_ENERGY) != OK) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            if (creep.memory.claim != null && creep.room.name != creep.memory.claim.roomName) {
                // If we're claiming a new room, special short-circuit:
                // Once they're full of energy, book it to a new room and get busy
                creep.say('NEW ROOM!!');
                creep.moveTo(Game.rooms[creep.memory.claim.roomName].controller, {visualizePathStyle: {stroke: '#ffff00'}});
                return;
            }
            let target;
            target = targeter.findEnergyDistributeTarget(creep);
            if (target == null) {
                creep.say('Going home');
                target = Game.getObjectById(creep.anchorId);
            }
            if (creep.transfer(target, RESOURCE_ENERGY) != OK) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};
