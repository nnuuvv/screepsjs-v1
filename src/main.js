const creepRoles = require('./creepRoles');
const roadScheduler = require("roadScheduler");
const recycle = require("recycle");
    
module.exports.loop = function () {
    
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
        recycle.run(Game.creeps[name]);
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
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                console.log("Hostiles detected!!!");
                creep.room.controller.activateSafeMode();
            }
            
        }
        
        creepRoles[creep.memory.role][2].run(creep);
        
        
    }
    roadScheduler.run();
}