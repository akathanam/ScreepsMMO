var creeps = require('creeps');

var roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {

    creeps.checkEnergy(creep);

    if(creep.memory.refueling) {
      creeps.getEnergy(creep);
    } else {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {reusePath: 5});
      }
    }
  }
};

module.exports = roleUpgrader;
