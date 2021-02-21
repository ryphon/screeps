'use strict';
var targeter = require('targeter');

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.anchorId == null) {
            // Assign creep to a source
            targeter.assignRoundRobinAnchorTarget(
                creep, FIND_SOURCES, (source) => true
            )
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            if (!creep.memory.harvesting) {
                creep.say('🔄 harvest');
            }
            creep.memory.harvesting = true;
        } else if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('store');
        }

        if(creep.memory.harvesting) {
            let source;
            if (Memory.roles.harvester.zones) {
                let link = targeter.findEnergyLinkWithdrawTarget(creep);
                if (link != null && creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(link, {visualizePathStyle: {stroke: '#ffaa00'}});
                    return;
                }
                source = Game.getObjectById(creep.memory.anchorId);
            } else {
                source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            } 
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            creep.memory.harvesting = false;
            let target = targeter.findEnergyStoreTarget(creep);
            if (target == null) {
                creep.say('Going home');
                target = Game.getObjectById(creep.anchorId);
            }
            if (creep.transfer(target, RESOURCE_ENERGY) != OK || (creep.store.getFreeCapacity() == 0)) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};
