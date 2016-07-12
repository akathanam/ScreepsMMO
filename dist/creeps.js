module.exports.getEnergy = function(creep) {
  if((creep.room.memory.useStorage) || (creep.memory.role == 'transporter')) {
    var container = Game.getObjectById(creep.room.memory.mainEnergyStorage);


    if((container) && (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
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

module.exports.checkEnergy = function(creep) {
  if(!creep.memory.refueling && creep.carry.energy == 0) {
    creep.memory.refueling = true;
  }

  if(creep.memory.refueling && creep.carry.energy == creep.carryCapacity) {
    creep.memory.refueling = false;
  }

};
