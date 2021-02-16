'use strict';

module.exports = {
    findRepairTarget(creep) {
        var target;
        for (let i = 1; i <= 10; i++) {
            console.log(creep.name + " searching for targets under " + i*10 + "% and " + i*10000 + "HP");
            // Find nearest repair target by 10% hits buckets
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (
                    (10*structure.hits/structure.hitsMax) < i &&
                    (structure.hits < i*10000)
                )
            })
            if (target != null) {
                creep.memory.repairTarget = target.id;
                break;
            }
        }
        return target;
    },

    findBuildTarget(creep) {
        return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    }
}