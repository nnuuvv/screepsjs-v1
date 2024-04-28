const pathing = require("../pathing");
const harvest = require("../actions/harvest");

const harvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            harvest.energy(creep, pathing.getSource(creep));
        } else {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION 
                            || structure.structureType === STRUCTURE_SPAWN 
                            || structure.structureType === STRUCTURE_CONTAINER) 
                        && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                },
                ignoreCreeps: true
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: {stroke: '#ffffff'},
                        ignoreCreeps: true
                    });
                }
            } else {
                if (Game.flags["parking"])
                    creep.moveTo(Game.flags["parking"].pos, {
                        visualizePathStyle: {stroke: '#a0dc57'}
                    });
            }
        }
    }
};

module.exports = harvester;