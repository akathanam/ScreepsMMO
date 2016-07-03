var roleTower = {
  run: function(tower) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      tower.attack(closestHostile);
    } else if (!tower.room.memory.redAlert) {
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < Math.min(structure.hitsMax,2000)
      });
      if(closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }

    }

  }
};

module.exports = roleTower;
