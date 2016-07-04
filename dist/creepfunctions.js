module.exports.getEnergy = function(creep) {
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
};
