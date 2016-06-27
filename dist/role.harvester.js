var roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {
    var misc = require('misc');

    if(creep.carry.energy < creep.carryCapacity) {
      if(creep.room.memory.emergencyEnergy) {
          misc.debuglog(creep + " using emergency energy");
          var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) > 0);
              }
            });

        if(container.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container, {reusePath: 5});
        }

      }
      else {
        var source = creep.pos.findClosestByRange(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {reusePath: 5});
        }
      }
    }
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN
            || structure.structureType == STRUCTURE_TOWER)  &&
            structure.energy < structure.energyCapacity);
          }
        });
        if(targets.length == 0) {
           targets = creep.room.find(FIND_STRUCTURES, {
              filter: (structure) => {
                return ((structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) < structure.storeCapacity));
              }
          });
        }
        if(targets.length > 0) {
          if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {reusePath: 5});
          }
        } else {
          if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {reusePath: 5});
          }
        }
      }
    }
  };
  module.exports = roleHarvester;
