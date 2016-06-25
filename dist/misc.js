/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* var mod = require('misc');
* mod.thing == 'a thing'; // true
*/

module.exports.debuglog = function(logText) {
  if(Memory.debugLog) {
    console.log(logText);
  }
};
