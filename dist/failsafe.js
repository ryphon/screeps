module.exports = {

    saveMyRoom: function() {

        var room = Game.spawns['Spawn1'].room;
        var walls = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART});
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        for (let wall of walls) {
            if (wall.hits <= 100) {
                if (hostiles.length > 0) {
                    room.controller.activateSafeMode();
                }
            }
        }
    }
};
