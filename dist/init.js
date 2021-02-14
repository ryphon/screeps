module.exports = {
    run: function() {
        console.log("Bootstrap initialization triggered");
        Memory.spawnQueue = [
            [[WORK, CARRY, MOVE], "Harvester1",  { memory: { role: 'harvester', harvesting: true}}],
            [[WORK, CARRY, MOVE], "Harvester2",  { memory: { role: 'harvester' }}],
            [[WORK, CARRY, MOVE], "Upgrader1",  { memory: { role: 'upgrader' }}],
            [[WORK, CARRY, MOVE], "Upgrader2",  { memory: { role: 'upgrader' }}],
            [[WORK, CARRY, MOVE], "Builder1",  { memory: { role: 'builder' }}],
            [[WORK, CARRY, MOVE], "Builder2",  { memory: { role: 'builder' }}],
            [[WORK, CARRY, MOVE], "Builder3",  { memory: { role: 'builder' }}],
            [[WORK, CARRY, MOVE], "Builder4",  { memory: { role: 'builder' }}],
            [[WORK, CARRY, MOVE], "Builder5",  { memory: { role: 'builder' }}],
            [[WORK, CARRY, MOVE], "Builder6",  { memory: { role: 'builder' }}],
        ];
        Memory.roles = {
            "harvester": {
                "minimumCount": 2,
                "desiredCount": 3,
                "bodyParts": [
                    [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
                    [WORK, CARRY, MOVE]
                ]
            },
            "defender": {
                "minimumCount": 0,
                "desiredCount": 1,
                "bodyParts": [
                    [RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH],
                    [RANGED_ATTACK,MOVE,MOVE,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH],
                ]
            },
            "upgrader": {
                "minimumCount": 1,
                "desiredCount": 2,
                "bodyParts": [
                    [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
                    [WORK, CARRY, MOVE]
                ]
            },
            "builder": {
                "minimumCount": 6,
                "desiredCount": 8,
                "bodyParts": [
                    [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
                    [WORK, CARRY, MOVE]
                ]
            },
            "repairer": {
                "minimumCount": 1,
                "desiredCount": 2,
                "bodyParts": [
                    [WORK,CARRY,MOVE,MOVE],
                    [WORK, CARRY, MOVE]
                ]
            }
        };
        Memory.roleNamesByPriority = [
            "harvester",
            "upgrader",
            "builder",
            "repairer",
            "defender"
        ];
        Memory.initialized = true;
    }
}