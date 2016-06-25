/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* var mod = require('population');
* mod.thing == 'a thing'; // true
*/
var misc = require('misc');

module.exports = function(spawn) {
  var roles = ['harvester', 'upgrader', 'builder', 'repairer'];
  for (var i in roles) {
    var role = roles[i];
    var creeps = spawn.room.find(FIND_MY_CREEPS, { filter: function(creep){if(creep.memory && creep.memory.role) return creep.memory.role == role; else return false;} });

    if (creeps.length < spawn.memory.minPopulation[role]) {
      if (spawn.memory.prioritize == role)
      spawn.memory.onlyBuild = role;

      if ((!spawn.memory.onlyBuild) || (spawn.memory.onlyBuild == role)) {
        // Missing creeps, spawn them
        misc.debuglog("Trying to spawn new " + role + " creep");
        var result = spawn.createCreep(spawn.memory.creepSpecs[role], null, {role:role, spawnOrigin:spawn.id});

        if (!(result < 0)) {
          misc.debuglog("Spawned new " + role + " creep");
        }
      }
    } else {
      if (spawn.memory.onlyBuild == role)
      spawn.memory.onlyBuild = null;
    }

  }
};
