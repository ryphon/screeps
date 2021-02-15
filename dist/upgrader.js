module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.store[RESOURCE_ENERGY] == 0) {
            if (creep.memory.building) {
                creep.say('🔄 withdraw');
            }
            creep.memory.upgrading = false;
	    }
	    
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            creep.moveTo(Game.flags.Flag1);
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};
