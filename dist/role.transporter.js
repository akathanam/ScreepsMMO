/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.transporter');
 * mod.thing == 'a thing'; // true
 */

 var roleTransporter = {

   /** @param {Creep} creep **/
   run: function(creep) {
     var misc = require('misc');
     if(creep.ticksToLive == 1) {
         if(creep.memory.specialization == 'tower') {
           delete creep.room.memory.towerHarvester;
         } else if(creep.memory.specialization == 'emergency') {
           delete creep.room.memory.emergencyHarvester;
         }
     }

    if(creep.carry.energy < creep.carryCapacity) {
      var source = null;

      if(creep.room.memory.emergencyEnergy) {
        misc.debuglog(creep + " using emergency energy");

        source = Game.getObjectById(creep.room.memory.idOfEmergencyEnergyStorage);

        if(_.sum(container.store) < creep.carryCapacity) {
          source = null;
        }

      }

      if (!source) {
        source = Game.getObjectById(creep.room.memory.mainEnergyStorage);
      }

      if (source) {
        if(source.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {reusePath: 5});
        }
      } else {
        source = creep.pos.findClosestByRange(FIND_SOURCES, {
          filter: (possibleSource) => {
            return (possibleSource != Game.getObjectById(creep.room.mainEnergySource));
          }
        });

        if((source) && (creep.harvest(source) == ERR_NOT_IN_RANGE)) {
          creep.moveTo(source, {reusePath: 5});
        }


      }
    } else {

      var target = null;
      var energy = 0;

       for (var sType in creep.memory.fuelStructures) {
        switch(creep.memory.fuelStructures[sType]) {
          case STRUCTURE_SPAWN:
            target = Game.getObjectById(creep.memory.spawnOrigin);
            if ((target) && (target.energy < target.energyCapacity)) {
              energy = Math.min(creep.carry.energy, (target.energyCapacity - target.energy));
            } else {
              target = null;
            }
            break;
          case STRUCTURE_EXTENSION:
              target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                  return ((structure.structureType == STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity));
                }
              });

              if (target) {
                energy = Math.min(creep.carry.energy, (target.energyCapacity - target.energy));
              } else {
                target = null;
              }
              break;
          case 'emergencyEnergy':
            target = Game.getObjectById(creep.room.memory.idOfEmergencyEnergyStorage);
            var storedEnergy = _.sum(target.store);
            if (storedEnergy < target.storeCapacity) {
              energy = Math.min(creep.carry.energy, (target.storeCapacity - storedEnergy));
            } else {
              target = null;
            }
            break;
          case STRUCTURE_TOWER:
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
              filter: (structure) => {
                return ((structure.structureType == STRUCTURE_TOWER) && (structure.energy < structure.energyCapacity));
              }
            });
            if(target) {
              energy = Math.min(creep.carry.energy, (target.energyCapacity - target.energy));
            }
            break;
          case STRUCTURE_CONTAINER:
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
              filter: (structure) => {
                return ((structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) < structure.storeCapacity));
              }
            });

            if (target) {
              energy = Math.min(creep.carry.energy, (target.storeCapacity - _.sum(target.store)));
            } else {
              target = null;
            }
            break;
        }

        if (target) {
          break;
        }
      }

      if(target) {
         if(creep.transfer(target, RESOURCE_ENERGY, energy) == ERR_NOT_IN_RANGE) {
           creep.moveTo(target, {reusePath: 5});
         }
       } else {
         if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
           creep.moveTo(creep.room.controller, {reusePath: 5});
         }
       }
}}
  }

module.exports = roleTransporter;
