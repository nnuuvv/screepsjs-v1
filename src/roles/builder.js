const pathing = require("../pathing");
const harvest = require("../actions/harvest");
const builder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, { filter: {structureType: STRUCTURE_SPAWN}});
            if (target) {
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {stroke: '#ffffff'}
                    });
                }
            }
            else {
                if (Game.flags["parking"])
                    creep.moveTo(Game.flags["parking"].pos, {
                        visualizePathStyle: {stroke: '#a0dc57'}
                    });
            }
        } else {
            harvest.energy(creep, pathing.getSource(creep));
        }
    }
};

module.exports = builder;