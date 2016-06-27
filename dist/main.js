require('init');

var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleRepairer = require('role.repair');
var roleTower = require('role.tower');
var population = require('population');
var garbagecollector = require('garbagecollector');
var misc = require('misc');

function sortDamagedWalls(spawn) {
  var currentWalls = spawn.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return ((spawn.memory.autoRepair.indexOf(structure.structureType) != -1)
      && (structure.hits < (structure.hitsMax / 3)));
    }
  });

  return currentWalls.sort(function(a, b){return a.hits-b.hits});

}

function getNumberOfBuilders(spawn) {
  var targets = spawn.room.find(FIND_CONSTRUCTION_SITES, {
    filter: (structure) => {
      return (spawn.memory.spawnBuilderFor.indexOf(structure.structureType) != -1);
    }
  }
  );
  var newNumberOfBuilders = 1;

  if(targets.length) {
    newNumberOfBuilders = Math.floor(targets.length / 3) + 1;
  }
  return Math.min(newNumberOfBuilders,spawn.memory.maxPopulation['builder']);
}

function getNumberOfRepairers(spawn) {
  var newNumberOfRepairers = 0;

  if((spawn.memory.idsOfDamagedWalls) && (spawn.memory.idsOfDamagedWalls.length)) {
    newNumberOfRepairers = Math.floor(spawn.memory.idsOfDamagedWalls.length / 10) + 1;
  }
  return Math.min(newNumberOfRepairers,spawn.memory.maxPopulation['repairer']);
}

module.exports.loop = function () {
  var currentTick = Game.time;

  if ((currentTick % 20) == 0) {

    garbagecollector();
    for(var name in Game.spawns) {
      var spawn = Game.spawns[name];

      var numberOfBuilders = getNumberOfBuilders(spawn);
      var numberOfRepairers = getNumberOfRepairers(spawn);

      spawn.memory.minPopulation['builder'] = numberOfBuilders;
      spawn.memory.minPopulation['repairer'] = numberOfRepairers;
      population(spawn);



  }
  for(var name in Game.rooms) {
    var room = Game.rooms[name];

    if (room.energyAvailable < (room.energyCapacityAvailable/3)) {
      if(!room.memory.emergencyEnergy) {
        misc.debuglog("Switching to emergency energy");
        room.memory.emergencyEnergy = true;
      }
    } else {
      if(room.memory.emergencyEnergy) {
        misc.debuglog("Switching to normal energy");
        room.memory.emergencyEnergy = false;
      }
    }
  }

}
  if ((currentTick % 50) == 0) {

    for(var name in Game.spawns) {
      var spawn = Game.spawns[name];

      misc.debuglog("Sort damaged Structures");
      var sortedWalls = sortDamagedWalls(spawn);
      var sortedWallsID = [];

      for (var i = 0; i < sortedWalls.length; i++) {
        sortedWallsID[i] = sortedWalls[i].id;
      }
      spawn.memory.idsOfDamagedWalls = sortedWallsID;
      sortedWalls = null;
      sortedWallsID = null;
    }
  }

  for(var name in Game.creeps) {
    var creep = Game.creeps[name];

    if(creep.memory.role == 'harvester') {

      roleHarvester.run(creep);
    }
    if(creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
    if(creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if(creep.memory.role == 'repairer') {
      roleRepairer.run(creep);
    }

  }
  var tower = Game.getObjectById('576e404267da7ce57838e072');
  roleTower.run(tower);

}
