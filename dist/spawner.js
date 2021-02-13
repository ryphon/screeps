var spawner = {
    run: function() {
        if (!Game.spawns['Spawn1'].spawning) {
            // Check for creep in spawn queue
            var spawnCreep = Memory.spawnQueue.shift();
            if (typeof spawnCreep !== "undefined") {
                // Check for role below minimum count
                var creepCounts = {};
                for (var role in Memory.roles) {
                    creepCounts[role] =  _.filter(Game.creeps, (creep) => creep.memory.role == role).length
                    if (creepsCounts[role] < role.minimumCount) {
                        var spawnCreep = [role.bodyParts[1], role + Game.time, {"memory":{"role":role}}]
                        break;
                    }
                }
            }
            if (typeof spawnCreep !== "undefined") {
                // Check for role below desired count
                for (var role in Memory.role) {
                    if (creepCounts[role] < role.desiredCount) {
                        var spawnCreep = [role.bodyParts[0], role + Game.time, {"memory":{"role":role}}]
                        break;
                    }
                }
            }
            if (typeof spawnCreep !== "undefined") {
                // Spawn desired creep, if any desired
                var ret = Game.spawns['Spawn1'].spawnCreep(
                    spawnCreep[0],
                    spawnCreep[1],
                    spawnCreep[2]
                );
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

module.exports = spawner;
