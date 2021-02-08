var spawner = {
    run: function(harvesterCount, upgraderCount, builderCount, repairCount) {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

        var harvesterSpawn = harvesters.length < harvesterCount;
        var upgraderSpawn = upgraders.length < upgraderCount;
        var builderSpawn = builders.length < builderCount;
        var repairerSpawn = repairers.length < repairCount;


        if(harvesterSpawn) {
            var newName = 'Harvester' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
        if(upgraderSpawn && !harvesterSpawn) {
            var newName = 'Upgrader' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        }
        if(builderSpawn && !upgraderSpawn && !harvesterSpawn) {
            var newName = 'Builder' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'builder'}});
        }
        if(repairerSpawn && !builderSpawn && !upgraderSpawn && !harvesterSpawn) {
            var newName = 'Repairer' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'repairer'}});
        }
    
    
        if(Game.spawns['Spawn1'].spawning) { 
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1, 
                Game.spawns['Spawn1'].pos.y, 
                {align: 'left', opacity: 0.8});
        }
    }
};

module.exports = spawner;
