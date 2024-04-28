const roleHarvester = require("roles/harvester");
const roleUpgrader = require("roles/upgrader");
const roleBuilder = require("roles/builder");
const roleRepairer = require("roles/repairer");
const creepRoles = {
    harvester: [4, [WORK, WORK, CARRY, MOVE], roleHarvester],
    upgrader: [4, [WORK, WORK, CARRY, MOVE], roleUpgrader],
    builder: [4, [WORK, WORK, CARRY, MOVE], roleBuilder],
    repairer: [2, [WORK, WORK, CARRY, MOVE], roleRepairer]
}

module.exports = creepRoles;