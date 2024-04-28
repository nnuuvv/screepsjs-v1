const creepRoles = require('creepRoles');
const roadScheduler = require("services/roadScheduler");
const storageScheduler = require("services/storageScheduler");
const wallScheduler = require("services/wallScheduler");
const sourceHarvesting = require("services/sourceHarvesting");
const recycle = require("recycle");
    
module.exports.loop = function () {
    
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
        
        /* 
        if (Game.creeps[name].body.length < creepRoles[Game.creeps[name].memory.role][1].length) {
            console.log(Game.creeps[name].body.length, creepRoles[Game.creeps[name].memory.role][1].length)
            recycle.run(Game.creeps[name]);
        }        
         */
            
    }
        
    let wasMissing = false;
    for (let type in creepRoles){
        const allOfType = _.filter(Game.creeps, (creep) => creep.memory.role === type)
        
        console.log(type + ": " + allOfType.length);
        
        if (allOfType.length < creepRoles[type][0] && !wasMissing) {
            let newName = type + Game.time;
            console.log('Trying to spawn new: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(creepRoles[type][1], newName,{memory: {role: type}});
            wasMissing = true;
        }
    }


    let first = true;
    for(let name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if(first){
            first = false;
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: function (obj) {
                    return obj.getActiveBodyparts(ATTACK) > 0;
                }
            });
            if(target) {
                console.log("Hostiles detected!!!");
                creep.room.controller.activateSafeMode();
            }
        }
        
        if (creep !== undefined)
            creepRoles[creep.memory.role][2].run(creep);
        
    }
    sourceHarvesting.run();
    roadScheduler.run();
    storageScheduler.buildExtensions(storageScheduler.storageStyle.GRID);
    wallScheduler.run();
}