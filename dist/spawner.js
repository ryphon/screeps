module.exports = {
    run: function() {
        if (!Game.spawns['Spawn1'].spawning) {
            // Check for creep in spawn queue
            var spawnCreep;
            if (Memory.spawnQueue.length > 0) {
                spawnCreep = Memory.spawnQueue.shift();
                console.log("Attempting to spawn creep from queue: " + spawnCreep[1]);
                if (
                    Game.spawns['Spawn1'].spawnCreep(
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
                    let role = Memory.roles[roleName];
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
                    for (let roleName of Memory.roleNamesByPriority) {
                        let role = Memory.roles[roleName];
                        if (creepCounts[roleName] < role.desiredCount) {
                            spawnCreep = [role.bodyParts[0], roleName + Game.time, {"memory":{"role":roleName}}]
                            console.log("Attempting to spawn creep for desired role: " + spawnCreep[1]);
                            break;
                        }
                    }
                }
                if (spawnCreep != null) {
                    // Spawn desired creep, if any
                    var ret = Game.spawns['Spawn1'].spawnCreep(
                        spawnCreep[0],
                        spawnCreep[1],
                        spawnCreep[2]
                    );
                }
            }
        } else {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                {align: 'left', opacity: 0.8}
            );
        }
    }
};
