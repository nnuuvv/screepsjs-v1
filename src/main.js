const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

module.exports.loop = function () {

    let name;
    for(name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    console.log('Builders: ' + builders.length);

    let newName;
    if(harvesters.length < 4) {
        newName = 'Harvester' + Game.time;
        console.log('Trying to spawn new: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    } else if(upgraders.length < 12) {
        newName = 'Upgrader' + Game.time;
        console.log('Trying to spawn new: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'upgrader'}});
    } else if(builders.length < 1) {
        newName = 'Builder' + Game.time;
        console.log('Trying to spawn new: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'builder'}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }


    let first = true;
    for(name in Game.creeps) {
        const creep = Game.creeps[name];

        if(first){
            first = false;
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                console.log("Hostiles detected!!!");
                //creep.room.controller.activateSafeMode();
            }
        }

        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
}