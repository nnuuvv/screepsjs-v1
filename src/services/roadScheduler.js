const roadScheduler = {
    run (){
        let extensionFlags = Object.keys(Game.flags).filter(flag => Game.flags[flag].name.includes("extensions"));
        extensionFlags = extensionFlags.map(flag => Game.flags[flag]);
        
        let notScheduled = [];
        // loop over rooms
        for (let roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            
            const controller = room.controller;

            // get sources in room
            const sources = room.find(FIND_SOURCES);
            
            for (let sourceKey in sources) {
                let path = [];
                path.push(...PathFinder.search(controller.pos, { pos: sources[sourceKey].pos, range: 1 }).path);
                
                for (let step in path) {
                    // check if steps already contain structures or construction sites
                    const structures = room.lookForAt(LOOK_STRUCTURES, path[step].x, path[step].y);
                    const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, path[step].x, path[step].y);
                    
                    // if no, build road
                    if (!structures.length && !sites.length) {
                        // visualize wanted path
                        room.visual.circle(path[step].x, path[step].y, {fill: "#9a46e3"});
                        const pos = new RoomPosition(path[step].x, path[step].y, roomName);
                        notScheduled.push(pos);
                        
                        if (Game.constructionSites.length < 80 || Game.constructionSites.length === undefined)
                            pos.createConstructionSite(STRUCTURE_ROAD);
                    }
                }
            }
        }
        return notScheduled;
    }

}

module.exports = roadScheduler;