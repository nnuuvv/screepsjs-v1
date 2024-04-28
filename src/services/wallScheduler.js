const wallScheduler = {
    run() {
        const wallFlags = Object.values(Game.flags).filter(flag => flag.name.includes("wall"));
        
        
        const walls = {};
        let prev = "1";
        wallFlags.forEach(wallFlags => {
            const wallPos = wallFlags.name.split(" ")[1].split("-");
            
            if (walls[wallPos[0]] === undefined) walls[wallPos[0]] = [];

            walls[wallPos[0]].push(wallFlags.pos);
            prev = wallPos[0]
            
        });
        Object.values(walls).forEach(wallPart => {
            let last;
            wallPart.forEach(pos => {
                if (last === undefined) {
                    last = pos;
                    return;
                }
                
                let wallTiles;                
                if (pos.x === last.x) {
                    wallTiles = this.getLine(last, pos, "y");
                    
                } else if (pos.y === last.y) {
                    wallTiles = this.getLine(last, pos, "x");
                }
                
                this.buildWalls(wallTiles);
                last = pos;
            });
        });
    },
    getLine(from, to, dir) {
        const diff = to[dir] - from[dir];
        const add = diff > 0 ? -1 : 1;
        const room = Game.rooms[from.roomName];
        
        let wallTiles = [];        
        for (let i = diff; i !== 0; i += add) {
            // get position
            const pos = new RoomPosition(from.x, from.y, room.name);
            // add to list if there's something there
            if (pos.lookFor(LOOK_TERRAIN) === "wall" && !pos.lookFor(LOOK_CONSTRUCTION_SITES).length && !pos.lookFor(LOOK_STRUCTURES).length) {
                wallTiles.push(pos);
                room.visual.circle(from.x,  from.y,{ fill: "#1648ec" });
            }
            from[dir] -= add;
        }
        
        const pos = new RoomPosition(from.x, from.y, room.name);
        
        // add to list if there's something there
        if (!pos.lookFor(pos.lookFor(LOOK_TERRAIN) === "wall" && LOOK_CONSTRUCTION_SITES).length && !pos.lookFor(LOOK_STRUCTURES).length) {
            wallTiles.push(pos);
            room.visual.circle(from.x,  from.y,{ fill: "#1648ec" });
        }
        
        return wallTiles;
    },
    buildWalls(walls) {
        if (walls[0] === undefined) return;
        
        const room = Game.rooms[walls[0].roomName];
        
        walls.forEach(wall => {
            room.createConstructionSite(wall, STRUCTURE_WALL);
        });
    }
}

module.exports = wallScheduler;