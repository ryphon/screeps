'use strict';
var targeter = require('targeter');

module.exports = {
    cleanMemory: function(creepName) {
        console.log("Cleaning up source memory for " + creepName);
        for (const sourceName in Memory.sources) {
            let source = Memory.sources[sourceName];
            if (source.creeps != null) {
                let idx = source.creeps.indexOf(creepName);
                if (idx !== -1) {
                    source.creeps.splice(idx, 1);
                }
            }
        }
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.sourceId == null) {
            // Assign creep to a source
            const sources = creep.room.find(FIND_SOURCES);
            if (Memory.sources == null) {
                console.log("Initializing sources memory");
                Memory.sources = sources.reduce((res, source) => {
                    res[source.id] = {'creeps': []};
                    return res;
                }, {})
            }
            const minSource = sources.reduce((res, source) =>
                (Memory.sources[source.id].creeps.length < Memory.sources[res.id].creeps.length) ? source : res
            );
            Memory.sources[minSource.id].creeps.push(creep.name);
            creep.memory.sourceId = minSource.id;
            console.log(creep.name + " assigned to source " + minSource.id);
        }

        if (creep.store[RESOURCE_ENERGY] == 0) {
            if (!creep.memory.harvesting) {
                creep.say('🔄 harvest');
            }
            creep.memory.harvesting = true;
        } else if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('store');
        }

        if(creep.memory.harvesting) {
            if (Memory.roles.harvester.zones) {
                var withdraw = targeter.findEnergyLinkWithdrawTarget(creep);
                if (withdraw != null && creep.withdraw(withdraw, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(withdraw, {visualizePathStyle: {stroke: '#ffaa00'}});
                    return;
                }
                var source = Game.getObjectById(creep.memory.sourceId);
            } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            } 
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            creep.memory.harvesting = false;
            var target = targeter.findEnergyStoreTarget(creep);
            if (target == null) {
                // If all else fails, go home
                target = Game.spawns["Spawn1"];
            }
            if (creep.transfer(target, RESOURCE_ENERGY) != OK || (creep.store.getFreeCapacity() == 0)) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};
