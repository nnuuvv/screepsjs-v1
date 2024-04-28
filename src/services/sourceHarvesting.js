const sourceHarvesting = {
    run() {
        const room = Object.values(Game.rooms).filter(rm => rm.controller.my);
        console.log(room[0]);
        const sources = this.getSources(room[0]);
        
    },
    /**
     * Get sources, only within room for now; Adapt to include nearby rooms
     * @param {Room} room
     */
    getSources(room) {
        return room.find(FIND_SOURCES);
    }
}

module.exports = sourceHarvesting;