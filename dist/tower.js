'use strict';

var targeter = require('targeter');

module.exports = {
    run: function(room) {
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${room.name}`);
            let healers = room.find(FIND_HOSTILE_CREEPS, {
                filter: (hostile) => hostile.getActiveBodyparts(HEAL) > 0
            });
            if (healers.length > 0) {
                towers.forEach(tower => tower.attack(healers[0]));
            } else {
                towers.forEach(tower => tower.attack(hostiles[0]));
            }
        } else {
            for (const tower of towers) {
                if (tower.store.getFreeCapacity(RESOURCE_ENERGY) < tower.store.getUsedCapacity(RESOURCE_ENERGY)) {
                    let target = targeter.findRepairTarget(tower);
                    if (target != null) {
                        tower.repair(target);
                    }
                }
            }
        }
    }
};
