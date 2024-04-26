const roadScheduler = {
    run: function () {
        // get one creep in each room


        // loop over one creep per room
        for (let roomName in Game.rooms) {
            const room = Game.rooms[roomName];

            const controller = room.controller;
            const spawner = room.find(FIND_MY_SPAWNS)[0];

            // get sources in room
            const sources = room.find(FIND_SOURCES);
            
            for (let sourceKey in sources) {
                let path = [];
                path.push(...PathFinder.search(controller.pos, { pos: sources[sourceKey].pos, range: 1 }).path);
                path.push(...PathFinder.search(spawner.pos, { pos: sources[sourceKey].pos, range: 1 }).path);
                
                
                for (let step in path) {
                    
                    // check if steps already contain structures or construction sites
                    const structures = room.lookAt(path[step].x, path[step].y).filter((option) => option.type === LOOK_STRUCTURES || option.type === LOOK_CONSTRUCTION_SITES)
                    
                    // if no, build road
                    if (structures.length === 0) {
                        // visualize wanted path
                        room.visual.circle(path[step].x, path[step].y, {fill: "#9a46e3"});
                    
                        new RoomPosition(path[step].x, path[step].y, roomName).createConstructionSite(STRUCTURE_ROAD);
                    }
                }
            }
            
        }
    }

}

module.exports = roadScheduler;