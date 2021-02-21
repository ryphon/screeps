'use strict';

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleDefender = require('role.defender');
var targeter = require('targeter');
var spawner = require('spawner');
var failsafe = require('failsafe');
var tower = require('tower');
var link = require('link');

module.exports.loop = function () {

    // Memory management
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            roleDefender.cleanMemory(name);
            roleHarvester.cleanMemory(name);
            targeter.cleanAnchorMemory(name);
            //console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Set memory configs and spawn queue for bootstrap
    if (!Memory.initialized || Object.keys(Memory.creeps).length == 0) {
        var init = require('init');
        init.run();
    }

    // Run room structures
    const room = Game.spawns['Spawn1'].room;
    failsafe.saveMyRoom(room);
    spawner.run(room);
    tower.run(room);
    link.run(room);

    // Task creeps
    for(const creep of Object.values(Game.creeps)) {
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
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
    }
}
