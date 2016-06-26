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
        if((creep.pos.findInRange(FIND_SOURCES, 2).length > 0) || (creep.build(targets[0]) == ERR_NOT_IN_RANGE)) {
          creep.moveTo(targets[0], {reusePath: 5});
        }
      } else {
        creep.moveTo(10,27, {reusePath: 5});
      }
    }
    else {
      var source = creep.pos.findClosestByRange(FIND_SOURCES);
      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {reusePath: 5});
      }
    }
  }
};

module.exports = roleBuilder;
