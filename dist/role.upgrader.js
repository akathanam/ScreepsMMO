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
      var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (((structure.structureType == STRUCTURE_CONTAINER) || (structure.structureType == STRUCTURE_STORAGE))
          && (structure.store[RESOURCE_ENERGY] > creep.room.memory.storeMinEnergy) && creep.room.memory.useStorage);
        }
      });
      if((container) && (container.id != creep.room.memory.idOfEmergencyEnergyStorage)) {
        if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container, {reusePath: 5});
        }
      } else {
        var source = creep.pos.findClosestByRange(FIND_SOURCES, {
          filter: (possibleSource) => {
            return (possibleSource.energy > 800);
          }
        });

        if((source) && (creep.harvest(source) == ERR_NOT_IN_RANGE)) {
          creep.moveTo(source, {reusePath: 5});
        }
      }
    }
    else {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {reusePath: 5});
      }
    }
  }
};

module.exports = roleUpgrader;
