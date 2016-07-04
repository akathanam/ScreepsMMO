var creeps = require('creeps');

var roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {

    creeps.checkEnergy(creep);

    if(creep.memory.refueling) {
        var source = Game.getObjectById(creep.room.memory.mainEnergySource);

        if(source.energy < creep.carryCapacity) {
          source = creep.pos.findClosestByRange(FIND_SOURCES, {
            filter: (possibleSource) => {
              return (possibleSource.energy > creep.carryCapacity);
            }
          });
        }
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
    }
    else {
      var container = Game.getObjectById(creep.room.memory.mainEnergyStorage);

      if(container) {
        if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container, {reusePath: 5});
        }
      }
    }
  }
};

module.exports = roleHarvester;
