/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* var mod = require('garbagecollector');
* mod.thing == 'a thing'; // true
*/

var misc = require('misc');

module.exports = function() {
  // Cleanup dead creeps

  var spawning = false;

  // Cleanup dead spawns
  misc.debuglog("GC: dead spawns");
  for (var name in Memory.spawns) {
    if (!Game.spawns[name]) {
      delete Memory.spawns[name];
    } else {
      if (Game.spawns[name].spawning != null)
      spawning = true;
    }
  }
  if (spawning == false) {
    misc.debuglog("GC: dead creeps");
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  } else
  misc.debuglog("GC: skip dead creeps, spawning in progress");
}
