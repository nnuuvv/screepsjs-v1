const harvest = {
    energy: (creep, target) => {
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
                visualizePathStyle: {stroke: '#ffaa00'},
                ignoreCreeps: false,
            });
        }
    }
}

module.exports = harvest;