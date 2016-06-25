/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('init');
 * mod.thing == 'a thing'; // true
 */

if (!Memory.init) {
    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        
        spawn.memory.creepSpecs = {};
        spawn.memory.creepSpecs['harvester'] = [WORK,WORK,CARRY,MOVE,MOVE];
        spawn.memory.creepSpecs['upgrader'] = [WORK,CARRY,CARRY,MOVE];
        spawn.memory.creepSpecs['builder'] = [WORK,CARRY,CARRY,MOVE];
        spawn.memory.creepSpecs['repairer'] = [WORK,CARRY,CARRY,MOVE];
        spawn.memory.minPopulation = {'harvester': 3, 'upgrader': 3, 'builder': 0, 'repairer': 4};
        spawn.memory.prioritize = 'harvester';
        spawn.repairers = [0,0,0,0,0,0,0,0,0,0];

    }
    
    Memory.init = true;
}