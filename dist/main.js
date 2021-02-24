'use strict';

var roleHarvester = require('role.harvester');
var roleDistributor = require('role.distributor');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleDefender = require('role.defender');
var roleClaim = require('role.claim');
var targeter = require('targeter');
var spawner = require('spawner');
var failsafe = require('failsafe');
var tower = require('tower');
var link = require('link');

module.exports.loop = function () {

    // Memory management
    for(const [name, creepMemory] of Object.entries(Memory.creeps)) {
        if(!Game.creeps[name]) {
            const anchorId = creepMemory.anchorId;
            roleDefender.cleanMemory(name);
            targeter.cleanAnchorMemory(name, anchorId);
            delete Memory.creeps[name];
        }
    }

    // Set memory configs and spawn queue for bootstrap
    if (!Memory.initialized || Object.keys(Memory.creeps).length == 0) {
        var init = require('init');
        init.run();
    }

    // Run room structures
    for (const room of Object.values(Game.rooms)) {
        failsafe.saveMyRoom(room);
        spawner.run(room);
        tower.run(room);
        link.run(room);
    }

    // Task creeps
    for(const creep of Object.values(Game.creeps)) {
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'distributor':
                roleDistributor.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;
            case 'defender':
                roleDefender.run(creep);
                break;
            case 'claim':
                roleClaim.run(creep);
                break;
        }
    }
}
