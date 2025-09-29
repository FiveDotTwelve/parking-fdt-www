"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParkingEvents = GetParkingEvents;
const google_1 = require("../../configs/google");
const google_2 = require("../../configs/google");
const env_1 = require("../../utils/env");
async function GetParkingEvents(parkingSpot, userId) {
    (0, google_2.setCredentialsForUser)(userId);
    const { data } = await google_1.calendar.events.list({
        calendarId: env_1.ENV.GOOGLE_CALENDAR_ID,
        q: parkingSpot,
        singleEvents: true,
        orderBy: 'startTime',
    });
    return data.items;
}
