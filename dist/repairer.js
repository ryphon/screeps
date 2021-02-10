var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //if(creep.store.getFreeCapacity() > 10) {
        //    var sources = creep.room.find(FIND_SOURCES);
        //    if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        //        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
        //        creep.say('🔄 harvest');
        //    }
        //}
	    if(creep.store.getFreeCapacity() > 0 && creep.memory.repairing == false) {
            var container = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER)
                }
            });
            if(creep.withdraw(container[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('withdraw');
                creep.moveTo(container[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
            });
            if(targets.length > 0) {
                var cur = 100;
                var targ;
                var curTicks = 9999;
                var ticks;
                for(var tar in targets) {
                    var hp = targets[tar].hits;
                    var max = targets[tar].hitsMax;
                    var percent = hp / max;
                    ticks = targets[tar].ticksToDecay
                    if (percent < cur || ticks < curTicks) {
                        curTicks = ticks
                        targ = targets[tar];
                        hp = targ.hits;
                        max = targ.hitsMax;
                        cur = hp / max;
                        if (ticks < 1000) {
                            if(targ.hits < '100000') {
                                break
                            }
                        }
                    }
                }
                try {
                    message = 'r>' + targ.id
                } catch(err) {
                    message = 'r>BADID'
                }
                creep.say(message);
                creep.memory.repairing = true;
                if(creep.repair(targ) == ERR_NOT_IN_RANGE || (creep.store.getFreeCapacity() == 0)) {
                    creep.moveTo(targ, {visualizePathStyle: {stroke: '#0fffff'}});
                }
            }
        }
        if (creep.memory.repairing == true && creep.store.getUsedCapacity() == 0) {
            creep.memory.repairing = false;
        }
	}
};

module.exports = roleRepairer;
