"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = CommandManager;
const actionReserve_1 = require("./commands/actions/actionReserve");
const parking_1 = require("./commands/parking");
const slack_1 = require("../config/slack");
function CommandManager() {
    (0, parking_1.Parking)(slack_1.app);
    (0, actionReserve_1.ActionReserve)(slack_1.app);
}
