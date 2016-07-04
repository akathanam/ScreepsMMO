var creeps = require('creeps');

var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {


    if(creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
    }
    if(!creep.memory.upgrading) {
      creeps.getEnergy(creep);
    } else {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {reusePath: 5});
      }
    }
  }
};

module.exports = roleUpgrader;
