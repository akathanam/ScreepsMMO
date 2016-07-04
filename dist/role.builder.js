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
      if(creep.room.memory.useStorage) {
        var container = Game.getObjectById(creep.room.memory.mainEnergyStorage);


        if((container) && (container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
          creep.moveTo(container, {reusePath: 5});
        }
      } else {
        var source = creep.pos.findClosestByRange(FIND_SOURCES, {
          filter: (possibleSource) => {
            return (possibleSource != Game.getObjectById(creep.room.mainEnergySource));
          }
        });

        if((source) && (creep.harvest(source) == ERR_NOT_IN_RANGE)) {
          creep.moveTo(source, {reusePath: 5});
        }
      }

    }
  }
};

module.exports = roleBuilder;
