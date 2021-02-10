var roleHarvester = require('harvester');
var roleUpgrader = require('upgrader');
var roleBuilder = require('builder');
var roleRepairer = require('repairer');
var spawner = require('spawner');
var failsafe = require('failsafe');
var tower = require('tower');

module.exports.loop = function () {
    // source 0 is top
    // source 1 is bottom
    // why hardcode though :(

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            //console.log('Clearing non-existing creep memory:', name);
        }
    }

    failsafe.saveMyRoom('W48S31');
    
    spawner.run(2, 2, 1, 1);
    //harvester, upgrader, builder, repairer

    //tower.run('W48S31');

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}
