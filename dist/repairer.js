var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getUsedCapacity()/creep.store.getCapacity() < 10) {
            var container = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER)
                }
            });
            if(creep.withdraw(container[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.say('withdraw');
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
            });
            if(targets.length > 0) {
                var cur = 100;
                var targ;
                for(var tar in targets) {
                    var hp = targets[tar].hits;
                    var max = targets[tar].hitsMax;
                    var percent = hp / max;
                    if (percent < cur) {
                        targ = targets[tar];
                        hp = targ.hits;
                        max = targ.hitsMax;
                        cur = hp / max;
                    }
                }
                creep.say('transferring');
                if ((max - hp) == 0) {
                    creep.say('waiting');
                    creep.moveTo(Game.flags.Flag2, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#0fffff'}});
                }
            }
        }
	}
};

module.exports = roleRepairer;
