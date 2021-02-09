module.exports = {

    saveMyRoom: function(myRoomName) {

        var walls = Game.rooms[myRoomName].find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART});
        for (let wall of walls) {
            if (wall.hits <= 100) {
                Game.rooms[myRoomName].controller.activateSafeMode();
            }
        }
    }
}; 
