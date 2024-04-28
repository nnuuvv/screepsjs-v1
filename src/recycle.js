const recycle = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // get spawn in room
        const target = creep.room.find(FIND_MY_SPAWNS);
        // recycle
        if (target[0].recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

module.exports = recycle;