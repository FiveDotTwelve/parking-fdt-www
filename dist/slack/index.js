"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackApp = SlackApp;
const actionReserve_1 = require("./actions/actionReserve");
const parking_1 = require("./commands/parking");
const slack_1 = require("../configs/slack");
const actionCancel_1 = require("./actions/actionCancel");
function SlackApp() {
    (0, parking_1.ParkingCommand)(slack_1.app);
    (0, actionReserve_1.ActionReserve)(slack_1.app);
    (0, actionCancel_1.ActionCancel)(slack_1.app);
}
