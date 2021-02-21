'use strict';

module.exports = {
    /*
    Links are all set to 'push' by default. Set one to 'pull' as needed with
    Memory.structures['<linkId>'].push = false;
    */
    run: function(room) {
        let links = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_LINK
        });
        if (Memory.structures == null) {
            Memory.structures = {};
        }
        for (const link of links) {
            if (Memory.structures[link.id] == null) {
                Memory.structures[link.id] = {'push': true}
            }
        }
        links = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => (
                structure.structureType == STRUCTURE_LINK &&
                Memory.structures[structure.id].push &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > structure.store.getFreeCapacity(RESOURCE_ENERGY)
            )
        });
        for (const link of links) {
            const targets = link.room.find(FIND_MY_STRUCTURES, {
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