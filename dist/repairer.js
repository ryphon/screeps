var roleRepairer = {

    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0 && creep.memory.repairing == false) {
            var container = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE)
                }
            });
            for (var i in container) {
                var baseline = 0;
                var targ;
                if (container[i].store[RESOURCE_ENERGY] > baseline) {
                    targ = container[i]
                    baseline = targ.store[RESOURCE_ENERGY]
                }
            }
            if(creep.withdraw(targ, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say('withdraw');
                creep.moveTo(targ, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return(structure.structureType == STRUCTURE_ROAD ||
                                                  structure.structureType == STRUCTURE_CONTAINER)}
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
                        if(targ.structureType == STRUCTURE_CONTAINER && targ.hits < '100000') {
                            creep.say("r>container");
                            break;
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
