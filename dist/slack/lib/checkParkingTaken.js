"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckParkingTaken = CheckParkingTaken;
const convertEvent_1 = __importDefault(require("./convertEvent"));
const getParkingEvents_1 = require("./getParkingEvents");
async function CheckParkingTaken(parkingSpot, date, userId) {
    const parkings = await (0, getParkingEvents_1.GetParkingEvents)(parkingSpot, userId);
    return parkings.some((ev) => (0, convertEvent_1.default)(ev).start === date);
}
