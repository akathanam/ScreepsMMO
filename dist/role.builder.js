var creepfunctions = require('creepfunctions');

var roleBuilder = {

  /** @param {Creep} creep **/
  run: function(creep) {


    if(creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
    }

    if(creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(targets.length) {
        if((creep.pos.findInRange(FIND_SOURCES, 2).length > 2) || (creep.build(targets[0]) == ERR_NOT_IN_RANGE)) {
          creep.moveTo(targets[0], {reusePath: 5});
        }
      } else {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller, {reusePath: 5});
        }

      }
    }
    else {
      creepfunctions.getEnergy(creep);

    }
  }
};

module.exports = roleBuilder;
