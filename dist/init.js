module.exports = {
    run: function() {
        console.log("Bootstrap initialization triggered");
        Memory.spawnQueue = [
            [[WORK, CARRY, MOVE], "Harvester1",  { memory: { role: 'harvester' }}],
            [[WORK, CARRY, MOVE], "Harvester2",  { memory: { role: 'harvester' }}],
            [[WORK, CARRY, MOVE], "Upgrader1",  { memory: { role: 'upgrader' }}],
            [[WORK, CARRY, MOVE], "Builder1",  { memory: { role: 'builder' }}],
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
                "minimumCount": 1,
                "desiredCount": 0,
                "bodyParts": [
                    [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
                    [WORK, CARRY, MOVE]
                ]
            },
            {
                "name": "repairer",
                "minimumCount": 1,
                "desiredCount": 0,
                "bodyParts": [
                    [WORK,CARRY,MOVE,MOVE],
                    [WORK, CARRY, MOVE]
                ]
            }
        ];
        Memory.initialized = true;
    }
}