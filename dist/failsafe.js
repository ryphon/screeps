'use strict';

module.exports = {

    saveMyRoom: function(room) {
        let walls = room.find(FIND_STRUCTURES, {
            filter: (s) =>
                s.structureType == STRUCTURE_WALL ||
                s.structureType == STRUCTURE_RAMPART});
        let hostiles = room.find(FIND_HOSTILE_CREEPS);
        for (let wall of walls) {
            if (wall.hits <= 100) {
                if (hostiles.length > 0) {
                    room.controller.activateSafeMode();
                }
            }
        }
    }
};
