const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roadScheduler = require("roadScheduler");
    
module.exports.loop = function () {
    
    const creepRoles = {
        harvester: [8, [WORK, CARRY, MOVE], roleHarvester],
        upgrader: [24, [WORK, CARRY, MOVE], roleUpgrader],
        builder: [1, [WORK, CARRY, MOVE], roleBuilder]
    }
    
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
        
    
    for (let type in creepRoles){
        const allOfType = _.filter(Game.creeps, (creep) => creep.memory.role === type)
        
        console.log(type + ": " + allOfType.length);
        
        if (allOfType.length < creepRoles[type][0]) {
            let newName = type + Game.time;
            console.log('Trying to spawn new: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(creepRoles[type][1], newName,
                {memory: {role: type}});
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
        
        //roadScheduler.run();
    }
}