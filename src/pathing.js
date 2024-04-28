const pathing = {
    getSource: (creep) => {
        
        return creep.pos.findClosestByPath(FIND_SOURCES);
    },
    moveTo: (creep, target) => {
        creep.moveTo(target);
    },
    getPath: (creep, target) => {
        let memPath = creep.room.memory.path;
        if (memPath.age < 100) {
            // cache is recent enough
            this.incrementMemoryPath(creep);
            return Room.deserializePath(memPath.path);
        } else {
            const path = creep.room.findPath(creep.pos, target.pos, {
                ignoreCreeps: true,
                plainCost: 1,
                swampCost: 5
            });
            creep.room.memory.path = { 
                age: 0,
                path: Room.serializePath(path) 
            };
        }
    },
    incrementMemoryPath: (creep) => {
        creep.room.memory.path.age++;
        console.log("pathing age: ", creep.room.memory.path.age);
    }
}

module.exports = pathing;