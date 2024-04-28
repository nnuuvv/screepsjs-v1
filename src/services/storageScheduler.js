const controllerLimits = require("../controllerLimits");

const storageScheduler = {
    storageStyle: {
        GRID: "GRID",
        PLUSES: "PLUSES"
    },
    buildExtensions(style) {
        const extensionFlags = Object.keys(Game.flags).filter(flag => Game.flags[flag].name.includes("extensions"));

        extensionFlags.forEach(flagJson => {
            const flag = Game.flags[flagJson];
            const location = JSON.parse(flagJson);

            switch (style) {
                case this.storageStyle.GRID:
                    storageScheduler.runGrid(new RoomPosition(flag.pos.x, flag.pos.y, flag.room.name), location.x, location.y, STRUCTURE_EXTENSION)
                    break;
                case this.storageStyle.PLUSES:
                    break;
                default:
                    console.log("No storage type defined");
            }
        });  
    },
    /**
      * @param {RoomPosition} pos - starting point
      * @param {number} dirX - x direction to expand in | 1 = right | -1 = left
      * @param {number} dirY - y direction to expand in | 1 = down | -1 = up
      * @param {string} storageType - one of the LOOK_* constants
      **/
    runGrid (pos,
             dirX,
             dirY,
             storageType) {
        
        let space;
        /*
        if (Memory[pos.roomName] === undefined
            || Memory[pos.roomName].storageScheduler === undefined
            || Memory[pos.roomName].storageScheduler[storageType] === undefined 
            || Memory[pos.roomName].storageScheduler[storageType].age > 100)
        {
            Memory[pos.roomName].storageScheduler[storageType] = {
                age: 0,
                storage: space
            }
        } else {
            space = Memory[pos.roomName].storageScheduler[storageType];
        }
        
         */
        const room = Game.rooms[pos.roomName];

        
        space = this.branchXDeep(pos, dirX, dirY, controllerLimits[storageType](room.controller.level));
        this.build(pos,  space,  storageType);
        this.draw(pos, space);
        
        
    },
    /**
     * 
     * @param pos
     * @param dirX
     * @param dirY
     * @param storageType
     */
    runPluses (pos,
               dirX,
               dirY,
               storageType) {
        
            
        
    },
    /** 
      * @param {RoomPosition} pos - starting point
      * @param {number} dirX - x direction to expand in | 1 = right | -1 = left
      * @param {number} dirY - y direction to expand in | 1 = down | -1 = up
      * @param {number} storageAmount - amount of storages to expand to
      * @param {number} distance - for recursion, can be left empty
      * @param {RoomPosition[]} roadTiles - array of RoomPositions where roads should be built
      * @param {RoomPosition[]} storageTiles - array of RoomPositions where storages should be built
      **/
    goStraight(pos,
               dirX = 0,
               dirY = 0,
               storageAmount = 5,
               distance = 0,
               roadTiles = [],
               storageTiles = []) {
        // return if room or storage limits reached
        if (pos.x <= 0 || pos.x >= 49 || pos.y <= 0 || pos.y >= 49 || storageTiles.length >= storageAmount) {
            return { distance: distance, roadTiles: roadTiles, storageTile: storageTiles };
        }
        const room = Game.rooms[pos.roomName];
        
        let look;
        
        // get current tiles
        if (dirX !== 0) {
            look = room.lookForAtArea(LOOK_TERRAIN, pos.y - 1, pos.x, pos.y + 1, pos.x, true);
        } else if (dirY !== 0) {
            look = room.lookForAtArea(LOOK_TERRAIN, pos.y, pos.x - 1, pos.y, pos.x + 1, true);
        }
        
        let notWall = true;
        // check path for wall structure
        const structure = room.lookForAt(LOOK_STRUCTURES, look[1].x, look[1].y);
        if (structure.length) {
            if (structure[0].structureType === "constructedWall") {
                notWall = false;
            } 
        }
        // at least one side of the road has space && road has space
        if (look[1].terrain !== "wall" && notWall && (look[0].terrain !== "wall" || look[2].terrain !== "wall")) {

            this.updateRoadTiles(roadTiles, look, room);
            if (storageTiles.length < storageAmount)
                this.updateStorageTiles(storageTiles, look, room);
            
            pos.x += dirX;
            pos.y += dirY;
            return this.goStraight(pos, dirX, dirY, storageAmount, distance + 1, roadTiles, storageTiles);
        } else {
            return { distance: distance, roadTiles: roadTiles, storageTile: storageTiles };
        }
    },
    /**
     * @param {RoomPosition} pos - starting point
     * @param {number} dirX - x direction to expand in | 1 = right | -1 = left
     * @param {number} dirY - y direction to expand in | 1 = down | -1 = up
     * @param {number} storageAmount - amount of storages to expand to
     * @param {number} branchDepth - depth to branch at | default 3 
     * @param {number} distance - for recursion, can be left empty
     * @param {RoomPosition[]} roadTiles - array of RoomPositions where roads should be built
     * @param {RoomPosition[]} storageTiles - array of RoomPositions where storages should be built
     **/
    branchXDeep(pos,
                  dirX = 0,
                  dirY = 0,
                  storageAmount = 5,
                  branchDepth = 3,
                  distance = 0,
                  roadTiles = [],
                  storageTiles = []) {
        // return if room or storage limits reached
        if (pos.x <= 0 || pos.x >= 49 || pos.y <= 0 || pos.y >= 49 || storageTiles.length >= storageAmount) {
            return { distance: distance, roadTiles: roadTiles, storageTile: storageTiles };
        }
        
        const room = Game.rooms[pos.roomName];

        let look;

        if (dirX !== 0) {
            look = room.lookForAtArea(LOOK_TERRAIN, pos.y - 1, pos.x, pos.y + 1, pos.x, true);
        } else if (dirY !== 0) { 
            look = room.lookForAtArea(LOOK_TERRAIN, pos.y, pos.x - 1, pos.y, pos.x + 1, true);
        }

        // at least one side of the road has space && road has space
        if (look[1].terrain !== "wall" && (look[0].terrain !== "wall" || look[2].terrain !== "wall")) {

            this.updateRoadTiles(roadTiles, look, room);
            
            // should start branch
            if(distance % branchDepth === 0) {
                this.doBranch(pos, dirX, dirY, storageAmount, roadTiles, storageTiles);
            }
            pos.x += dirX;
            pos.y += dirY;
            return this.branchXDeep(pos, dirX, dirY, storageAmount, branchDepth, distance + 1, roadTiles, storageTiles);
        } else {
            return { distance: distance, roadTiles: roadTiles, storageTile: storageTiles };
        }
    },
    /**
     * 
     * @param pos
     * @param dirX
     * @param dirY
     * @param storageAmount
     * @param roadTiles
     * @param storageTiles
     */
    doBranch(pos, dirX, dirY, storageAmount, roadTiles, storageTiles) {
        let branchNeg;
        let negX = new RoomPosition(pos.x - 1, pos.y, pos.roomName);
        let negY = new RoomPosition(pos.x, pos.y - 1, pos.roomName);
        // get neg Y branch
        if (dirX !== 0) {
            branchNeg = this.goStraight(negY, 0, -1, storageAmount - storageTiles.length);
            // get neg X branch
        } else if (dirY !== 0) {
            branchNeg = this.goStraight(negX, -1, 0, storageAmount - storageTiles.length);
        }
        // if long enough, add to tiles
        if (branchNeg.distance > 2) {
            roadTiles.push(...branchNeg.roadTiles);
            storageTiles.push(...branchNeg.storageTile);
        }

        let branchPos;
        let posX = new RoomPosition(pos.x + 1, pos.y, pos.roomName);
        let posY = new RoomPosition(pos.x, pos.y + 1, pos.roomName);
        // get positive Y branch
        if (dirX !== 0) {
            branchPos = this.goStraight(posY, 0, 1, storageAmount - storageTiles.length);
        } else if (dirY !== 0) {
            branchPos = this.goStraight(posX, 1, 0, storageAmount - storageTiles.length);
        }
        // if long enough, add to tiles
        if (branchPos.distance > 2) {
            roadTiles.push(...branchPos.roadTiles);
            storageTiles.push(...branchPos.storageTile);
        }
        
    },
    /**
     * 
     * @param storageTiles
     * @param look
     * @param room
     */
    updateStorageTiles(storageTiles, look, room) {
        if (look[0].terrain !== "wall"
            && !room.lookForAt(LOOK_STRUCTURES, look[0].x, look[0].y).length
            && !room.lookForAt(LOOK_CONSTRUCTION_SITES, look[0].x, look[0].y).length)
            storageTiles.push(new RoomPosition(look[0].x, look[0].y, room.name));

        if (look[2].terrain !== "wall"
            && !room.lookForAt(LOOK_STRUCTURES, look[2].x, look[2].y).length
            && !room.lookForAt(LOOK_CONSTRUCTION_SITES, look[2].x, look[2].y).length)
            storageTiles.push(new RoomPosition(look[2].x, look[2].y, room.name));
    },
    /**
     * 
     * @param roadTiles
     * @param look
     * @param room
     */
    updateRoadTiles(roadTiles, look, room) {
        if (!room.lookForAt(LOOK_STRUCTURES, look[1].x, look[1].y).length
            && !room.lookForAt(LOOK_CONSTRUCTION_SITES, look[1].x, look[1].y).length)
            roadTiles.push(new RoomPosition(look[1].x, look[1].y, room.name));
    },
    build(pos, space, storageType) {
        
        const maxAmount = controllerLimits[storageType](Game.rooms[pos.roomName].controller.level);
        
        space.storageTile.map(tile => {
            const alreadyScheduled = Game.rooms[pos.roomName].find(FIND_MY_CONSTRUCTION_SITES, { filter: { structureType: storageType}}).length;
            if (maxAmount > alreadyScheduled)
                tile.createConstructionSite(storageType);
        });
    },
    draw(pos, space) {
        space.roadTiles.map(tile => {
            Game.rooms[pos.roomName].visual.circle(
                tile.x,
                tile.y,
                { fill: "#9b9494", radius: 0.3 }
            );
        });
        
        space.storageTile.map(tile => {
            Game.rooms[pos.roomName].visual.circle(
                tile.x,
                tile.y,
                {fill: "#ffd946"}
            );
        });
    }

}

module.exports = storageScheduler;