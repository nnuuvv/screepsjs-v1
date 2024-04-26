const roleHarvester = require("./role.harvester");
const roleUpgrader = require("./role.upgrader");
const roleBuilder = require("./role.builder");
const roleRepairer = require("./role.repairer");
const creepRoles = {
    harvester: [8, [WORK, CARRY, CARRY, MOVE, MOVE], roleHarvester],
    upgrader: [16, [WORK, CARRY, CARRY, MOVE, MOVE], roleUpgrader],
    builder: [12, [WORK, CARRY, CARRY, MOVE, MOVE], roleBuilder],
    repairer: [2, [WORK, CARRY, CARRY, MOVE, MOVE], roleRepairer]
}

module.exports = creepRoles;