var spawnCounter = 0;

module.exports = {
    /*
     * These are convenience scripts to be called from the console.
     * i.e. call spawnStatus like `> require('management').spawnStatus(Game.rooms['E42S27'])`
     */
    spawnStatus: function(room) {
        var creepCounts = {};
        for (const roleName of room.memory.roleNamesByPriority) {
            const role = room.memory.roles[roleName];
            creepCounts[roleName] =  room.find(FIND_MY_CREEPS, {
                filter: (creep) => (
                creep.room.name == room.name &&
                creep.memory.role == roleName
            )}).length
            console.log(room.name + " - " + roleName + " - " + creepCounts[roleName] + " of Minimum: " + role.minimumCount + ", Desired: " + role.desiredCount);
        }
        console.log(room.name + " - " + room.memory.spawnQueue.length + " creeps in spawnQueue");
        for (const spawnCreep of room.memory.spawnQueue) {
            console.log(room.name + " - " + spawnCreep[2]);
        }
        console.log(room.name + " - " + room.energyAvailable + " of " + room.energyCapacityAvailable + " energy");
    },

    executeClaim(fromRoomName, toRoomName) {
        /* UNTESTED!!
         * This script can be executed to attempt at claiming an uncontested neutral room
         * To use:
         * - Set a flag where you would like a defender to go anchor or let the script create one on the room controller.
         * - Run `require('management').executeClaim('<room-to-claim-from>', '<the-room-you-want>')`
         roleSummary*/
        const fromRoom = Game.rooms[fromRoomName];
        const toRoom = Game.rooms[toRoomName];
        fromRoom.memory.claim = {
            roomName: toRoomName
        }
        // Use a flag or set one
        let flag = toRoom.controller.pos.findClosestByPath(FIND_FLAGS);
        if (flag == null) {
            flag = Game.flags[toRoom.createFlag(toRoom.controller.pos)];
            console.log('Created a flag in ' + toRoomName + " - " + flag.name);
        } else {
            console.log('Found a flag in ' + toRoomName + " - " + flag.name); }
        // // Send a defender to the flag
        console.log('Queueing defender in spawnQueue at ' + fromRoom);
        fromRoom.memory.spawnQueue.push(
            [
                [
                    TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                    MOVE, MOVE,
                    RANGED_ATTACK, RANGED_ATTACK
                ],
                "Defender" + Game.time,
                { memory: { role: 'defender', flagName: flag.name }}]
        );
        // Send the claimer to the controller
        console.log('Queueing claimer in spawnQueue at ' + fromRoom);
        fromRoom.memory.spawnQueue.push(
            [[MOVE, MOVE, MOVE, MOVE, CLAIM], "claim" + Game.time,  { memory: { role: 'claim', roomName: toRoomName}}]
        )
        // Send builders to build spawn
        this.reinforceClaim(fromRoom, 'builder')
        this.reinforceClaim(fromRoom, 'builder')
        this.reinforceClaim(fromRoom, 'builder')
        this.reinforceClaim(fromRoom, 'builder')
        this.reinforceClaim(fromRoom, 'upgrader')
    },

    reinforceClaim(fromRoom, roleName) {
        console.log('Queueing ' + roleName + 'in spawnQueue at ' + fromRoom);
        fromRoom.memory.spawnQueue.push(
                [fromRoom.memory.roles[roleName].bodyParts[0], roleName + Game.time,  { memory: { role: roleName, claim: fromRoom.memory.claim}}]
        )
    }
};
