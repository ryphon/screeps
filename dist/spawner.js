'use strict';

module.exports = {
    /*
    Spawner is driven by in-memory configuration. When evaluating what to spawn,
    if anything, it will prioritize:
    1) anything in Memory.spawnQueue,
    2) any role with creep count below Memory.role.X.minimumCount, in order of
        Memory.roleNamesByPriority
    3) any role with creep count below Memory.role.X.desiredCount, in order of
        Memory.roleNamesByPriority

    If there is anything in the spawn queue, it will try to spawn that. If there
    is any role under its minimumCount, it will spawn a new creep with the body
    parts listed in Memory.role.X.bodyParts[1]. Lastly, if there is a role under
    its desiredCount, it will spawn a new creep with the body parts listed in
    Memory.role.X.bodyParts[0].
    */
    run: function(room) {
        const spawns = room.find(FIND_MY_SPAWNS);
        for (const spawn of spawns) {
            if (!spawn.spawning) {
                // Check for creep in spawn queue
                let spawnCreep;
                if (Memory.spawnQueue.length > 0) {
                    spawnCreep = Memory.spawnQueue.shift();
                    console.log("Attempting to spawn creep from queue: " + spawnCreep[1]);
                    if (
                        spawn.spawnCreep(
                            spawnCreep[0],
                            spawnCreep[1],
                            spawnCreep[2]
                        ) != 0
                    ) {
                        Memory.spawnQueue.unshift(spawnCreep);
                    }
                } else {
                    // Check for role below minimum count
                    var creepCounts = {};
                    for (const roleName of Memory.roleNamesByPriority) {
                        const role = Memory.roles[roleName];
                        creepCounts[roleName] =  _.filter(Game.creeps, (creep) => creep.memory.role == roleName).length
                        console.log(roleName + " - " + creepCounts[roleName] + " of Minimum: " + role.minimumCount + ", Desired: " + role.desiredCount);
                        if (creepCounts[roleName] < role.minimumCount) {
                            spawnCreep = [role.bodyParts[1], roleName + Game.time, {"memory":{"role":roleName}}]
                            console.log("Attempting to spawn creep for minimum role: " + spawnCreep[1]);
                            break;
                        }
                    }
                    if (spawnCreep == null) {
                        // Check for role below desired count
                        for (const roleName of Memory.roleNamesByPriority) {
                            const role = Memory.roles[roleName];
                            if (creepCounts[roleName] < role.desiredCount) {
                                spawnCreep = [role.bodyParts[0], roleName + Game.time, {"memory":{"role":roleName}}]
                                console.log("Attempting to spawn creep for desired role: " + spawnCreep[1]);
                                break;
                            }
                        }
                    }
                    if (spawnCreep != null) {
                        // Spawn desired creep, if any
                        spawn.spawnCreep(
                            spawnCreep[0],
                            spawnCreep[1],
                            spawnCreep[2]
                        );
                    }
                }
            } else {
                const spawningCreep = Game.creeps[spawn.spawning.name];
                room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawn.pos.x + 1,
                    spawn.pos.y,
                    {align: 'left', opacity: 0.8}
                );
            }
        }
    }
};
