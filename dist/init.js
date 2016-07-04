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
    spawn.memory.creepSpecs['transporter'] = [WORK,CARRY,CARRY,CARRY,MOVE,MOVE];
    spawn.memory.minPopulation = {'harvester': 3, 'upgrader': 3, 'builder': 0, 'repairer': 4};
    spawn.memory.maxPopulation = {'harvester': 3, 'upgrader': 3, 'builder': 4, 'repairer': 4};
    spawn.memory.prioritize = 'harvester';
    spawn.memory.autoRepair = [STRUCTURE_TOWER, STRUCTURE_WALL, STRUCTURE_ROAD, STRUCTURE_RAMPART, STRUCTURE_CONTAINER];
    spawn.memory.spawnBuilderFor = [STRUCTURE_TOWER, STRUCTURE_ROAD, STRUCTURE_CONTAINER];
    spawn.repairers = [0,0,0,0,0,0,0,0,0,0];

  }

  Memory.init = true;
}
