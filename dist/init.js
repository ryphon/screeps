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
        Memory.roles = [
            {
                "name": "harvester",
                "minimumCount": 2,
                "desiredCount": 3,
                "bodyParts": [
                    [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
                    [WORK, CARRY, MOVE]
                ]
            },
            {
                "name": "upgrader",
                "minimumCount": 1,
                "desiredCount": 2,
                "bodyParts": [
                    [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
                    [WORK, CARRY, MOVE]
                ]
            },
            {
                "name": "builder",
                "minimumCount": 3,
                "desiredCount": 4,
                "bodyParts": [
                    [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
                    [WORK, CARRY, MOVE]
                ]
            },
            {
                "name": "repairer",
                "minimumCount": 0,
                "desiredCount": 1,
                "bodyParts": [
                    [WORK,CARRY,MOVE,MOVE],
                    [WORK, CARRY, MOVE]
                ]
            }
        ];
        Memory.initialized = true;
    }
}