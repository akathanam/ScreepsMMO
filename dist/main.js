require('init');

var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleRepairer = require('role.repair');
var roleTower = require('role.tower');
var population = require('population');
var garbagecollector = require('garbagecollector');
var misc = require('misc');

function convertToID(item, index, arr) {
  arr[index] = item.id;
}

function sortDamagedWalls(spawn) {
  var currentWalls = spawn.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return ((spawn.memory.autoRepair.indexOf(structure.structureType) != -1)
      && (structure.hits < (structure.hitsMax / 3)));
    }
  });

  var sortedWalls = currentWalls.sort(function(a, b){return a.hits-b.hits});
  sortedWalls.forEach(convertToID);

  return sortedWalls;
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

    var towers = [];

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

      var storages = room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_STORAGE }});
      misc.debuglog("checking energy storage");
      if (storages.length > 0) {
        storage = storages[0];
        misc.debuglog("found energy storage");
        if (storage.store[RESOURCE_ENERGY] < room.memory.storeMinEnergy) {
          misc.debuglog("forbidding creeps from using stored energy");
          room.memory.useStorage = false;
        } else if (storage.store[RESOURCE_ENERGY] > room.memory.storeMaxEnergy) {
          misc.debuglog("allowing creeps to use stored energy");
          room.memory.useStorage = true;
        }

      }

      var towersInRoom = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER}
      });

      if (towersInRoom.length > 0) {
        towers.push.apply(towers, towersInRoom);
      }
    }

    towers.forEach(convertToID);

    Memory.towers = towers;
  }
  if ((currentTick % 50) == 0) {

    for(var name in Game.spawns) {
      var spawn = Game.spawns[name];

      misc.debuglog("Sort damaged Structures");
      var sortedWalls = sortDamagedWalls(spawn);
      spawn.memory.idsOfDamagedWalls = sortedWalls;
    }
  }

  for(var name in Game.creeps) {
    var creep = Game.creeps[name];

    if(creep.memory.role == 'harvester') {
      if((!creep.room.memory.towerHarvester) && (!creep.memory.specialization)) {
        creep.memory.specialization = 'tower';
        creep.memory.fuelStructures = [STRUCTURE_TOWER, STRUCTURE_SPAWN,STRUCTURE_EXTENSION,'emergencyEnergy'];
        creep.room.memory.towerHarvester = creep.id;
        misc.debuglog("Selecting new tower harverster: " + creep.name);
      } else if((!creep.room.memory.emergencyHarvester) && (!creep.memory.specialization)) {
        creep.memory.specialization = 'emergency';
        creep.memory.fuelStructures = ['emergencyEnergy', STRUCTURE_SPAWN,STRUCTURE_EXTENSION, STRUCTURE_STORAGE, STRUCTURE_CONTAINER];
        creep.room.memory.emergencyHarvester = creep.id;
        misc.debuglog("selecting new emergency harvester: " + creep.name);
      }

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

  if ((Memory.towers) && (Memory.towers.length > 0)) {
    for (var tIndex in Memory.towers) {
      roleTower.run(Game.getObjectById(Memory.towers[tIndex]));
    }
  }
}
