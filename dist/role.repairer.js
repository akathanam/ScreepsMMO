var misc = require('misc');
var creeps = require('creeps');

var roleRepairer = {


  /** @param {Creep} creep **/
  run: function(creep) {

    if(creep.memory.repairing && creep.carry.energy == 0) {
      creep.memory.repairing = false;
    }

    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repairing = true;
      creep.memory.maxDamagedWall = null;
    }

    if(creep.memory.repairing) {
      if(!creep.memory.maxDamagedWall) {
        var spawn = Game.getObjectById(creep.memory.spawnOrigin)
        var numOfReps = spawn.memory.minPopulation['repairer'];
        var pos = Math.floor(Math.random() * (numOfReps+1));
        misc.debuglog(creep.name + ' Repairing Structure pos #' + pos);
        if(spawn.memory.idsOfDamagedWalls)
        creep.memory.maxDamagedWall = spawn.memory.idsOfDamagedWalls[pos];
      }

      var target = Game.getObjectById(creep.memory.maxDamagedWall);
      if ((target) && (target.hits < target.hitsMax)) {
        if((creep.pos.findInRange(FIND_SOURCES, 1).length > 0) || (creep.repair(target) == ERR_NOT_IN_RANGE)) {
          creep.moveTo(target, {reusePath: 5});
        }
      }
    }
    else {
      creeps.getEnergy(creep);
    }
  }
};

module.exports = roleRepairer;
