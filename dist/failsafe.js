module.exports = {

    saveMyRoom: function(myRoomName) {

        var walls = Game.rooms[myRoomName].find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART});
        var hostiles = Game.rooms[myRoomName].find(FIND_HOSTILE_CREEPS);
        for (let wall of walls) {
            if (wall.hits <= 100) {
                if (hostiles.length > 0) {
                    Game.rooms[myRoomName].controller.activateSafeMode();
                }
            }
        }
    }
};
