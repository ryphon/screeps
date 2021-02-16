'use strict';
var targeter = require('targeter');

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
            var target = targeter.findEnergyStoreTarget(creep);
            if (target == null) {
                // If all else fails, go home
                target = Game.spawns["Spawn1"];
            }
            if(creep.transfer(target, RESOURCE_ENERGY) != OK || (creep.store.getFreeCapacity() == 0)) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};
