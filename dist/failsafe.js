'use strict';

module.exports = {
    /*
    If there are hostiles in the room and any walls or ramparts are about to fail,
    activate SafeMode in the room's controller.
    */
    saveMyRoom: function(room) {
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            const failing = room.find(FIND_STRUCTURES, {
                filter: (s) =>
                    (
                        s.structureType == STRUCTURE_WALL ||
                        s.structureType == STRUCTURE_RAMPART
                    ) && wall.hits <= 100
            });
            if (failing.length > 0) {
                room.controller.activateSafeMode();
            }
        }
    }
};
