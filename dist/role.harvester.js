'use strict';
var targeter = require('targeter');

module.exports = {
    /*
    Harvesters harvest energy from sources and dump it in containers that can hold energy.
    Harvesters operate in two behavior modes:

    1) free-range. When Memory.roles.harvester.zones != true, harvesters will seek out the
    nearest available source to pull energy from. This tends to work well early game.

    2) zones. When Memory.roles.harvester == true, harvesters will only harvest energy from
    their source or the nearest link to their source if the link is set to 'pull' mode.
    Harvesters will then fill structures starting nearest to the source. You can limit the
    range from the source that a harvester will go to fill a source by setting
    Memory.roles.harvesters.zoneRange to a number.
    */
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
            const res = creep.harvest(source);
            if (res == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if (res == ERR_NOT_ENOUGH_RESOURCES && creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
                creep.memory.harvesting = false;
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            creep.memory.harvesting = false;
            let target;
            if (Memory.roles.harvester.zones && Memory.roles.harvester.zoneRange != null) {
                target = targeter.findEnergyStoreTargetInRange(creep, Memory.roles.harvester.zoneRange);
            } else {
                target = targeter.findEnergyStoreTarget(creep);
            }
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
