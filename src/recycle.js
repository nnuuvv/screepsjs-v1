const creepRoles = require('./creepRoles');

const recycle = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // if body is smaller than configured i.e. old
        if (creep.body.length < creepRoles[creep.memory.role][1].length) {
            // get spawn in room
            const target = creep.room.find(FIND_MY_SPAWNS);
            // recycle
            if (target[0].recycleCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = recycle;