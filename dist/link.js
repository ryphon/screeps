'use strict';

module.exports = {
    run: function() {
        var room = Game.spawns['Spawn1'].room;
        const links = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => (
                structure.structureType == STRUCTURE_LINK &&
                Memory.structures[structure.id].push &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > structure.store.getFreeCapacity(RESOURCE_ENERGY)
            )
        });
        for (const link of links) {
            let targets = link.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType == STRUCTURE_LINK &&
                    !Memory.structures[structure.id].push &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) >= structure.store.getUsedCapacity(RESOURCE_ENERGY)
                )
            });
            if (targets.length > 0) {
                link.transferEnergy(targets[0]);
            }
        }
    }
}