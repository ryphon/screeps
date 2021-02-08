var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0 && creep.memory.harvesting == true) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.say('🔄 harvest');

            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && 
                                (structure.store.getCapacity(RESOURCE_ENERGY) - structure.store[RESOURCE_ENERGY]) >= 0;
                    }
            });
            if(targets.length > 0) {
                var cur = 1;
                var targ;
                for(var tar in targets) {
                    var used = targets[tar].store[RESOURCE_ENERGY];
                    var cap = targets[tar].store.getCapacity(RESOURCE_ENERGY);
                    var pct = used / cap;
                    if (pct < cur) {
                        targ = targets[tar];
                        var used = targ.store[RESOURCE_ENERGY];
                        var cap = targ.store.getCapacity(RESOURCE_ENERGY);
                        cur = used / cap;
                    }
                }
                if (targ == undefined) {
                    targ = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return(structure.structureType == STRUCTURE_CONTAINER);}})[0];
                }
                try {
                    message = 'h>' + targ.id
                } catch(err) {
                    message = 'h>BADID'
                }
                creep.say(message);
                creep.memory.harvesting = false;
                if(creep.transfer(targ, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || (creep.store.getFreeCapacity() == 0)) {
                    creep.moveTo(targ, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        if (creep.memory.harvesting == false && creep.store.getCapacity() == creep.store.getFreeCapacity()) {
            creep.memory.harvesting = true;
        }
	}
};

module.exports = roleHarvester;
