var spawner = {
    run: function(harvesterCount, upgraderCount, builderCount) {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');


        if(harvesters.length < harvesterCount) {
            var newName = 'Harvester' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
        if(upgraders.length < upgraderCount) {
            var newName = 'Upgrader' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        }
        if(builders.length < builderCount) {
            var newName = 'Builder' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'builder'}});
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
