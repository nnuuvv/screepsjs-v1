const roadScheduler = {
    run() {
        // get one creep in each room
        let oneCreepPerRoom;
        
        for (let creep in Game.creeps) {
            if (oneCreepPerRoom[Game.creeps[creep].room.name])
            {
                
            }
        }
        

        // loop over one creep per room
        for (let creep in oneCreepPerRoom) {
            // get spawner location
            const spawner = Game.spawns.filter(spawn => spawn.room.name === creep.room.name);
            const controller = spawner.room.controller;
            // get sources in room
            const sources = creep.pos.find(FIND_SOURCES);

            for(let source in sources) {
                const path = creep.findPath(spawner.pos, source.pos).append(creep.findPath(controller.pos, source.pos));
                const roadless = path.filter((step) => !RoomPosition(step.x, step.y, creep.room.name).look()[1].structure);

                //RoomPosition(roadless.x, roadless.y, creep.room.name);
                roadless.map(toBuild => toBuild.pos.createConstructionSite(STRUCTURE_ROAD));
            }
        }    
    }
    
}

module.exports = roadScheduler;