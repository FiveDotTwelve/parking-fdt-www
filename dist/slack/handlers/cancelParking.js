"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelParking = void 0;
const google_1 = require("../../configs/google");
const env_1 = require("../../utils/env");
const tokenStorage_1 = require("../../utils/tokenStorage");
const convertEvent_1 = __importDefault(require("../lib/convertEvent"));
const dateUtils_1 = require("../../utils/dateUtils");
const cancelModal_1 = require("../modals/cancelModal");
const CancelParking = async (user_id, client, trigger_id, respond) => {
    if (!(await (0, tokenStorage_1.getToken)(user_id))) {
        await respond({
            response_type: 'ephemeral',
            text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
        });
        return;
    }
    else {
        await (0, google_1.setCredentialsForUser)(user_id);
        const nextWeekDate = new Date();
        nextWeekDate.setDate(nextWeekDate.getDate() + 7);
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const { end } = (0, dateUtils_1.GetWeek)(nextWeekDate);
        const { data } = await google_1.calendar.events.list({
            calendarId: env_1.ENV.GOOGLE_CALENDAR_ID,
            singleEvents: true,
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            orderBy: 'startTime',
        });
        // Step 1: Get the user's own email
        const { data: user } = await google_1.calendar.settings.get({ setting: "id" });
        const userEmail = user.value;
        console.log('userEmail', userEmail);
        const parking = (data.items || [])
            .map(convertEvent_1.default)
            .filter((a) => ['FDT Parking 7', 'FDT Parking 8', 'FDT Parking 9', 'FDT Parking MOL'].includes(a.summary || ''));
        if (parking.length === 0) {
            await respond({
                response_type: 'ephemeral',
                text: 'You have no upcoming parking reservations to cancel.',
            });
            return;
        }
        try {
            await client.views.open({
                trigger_id: trigger_id,
                view: (0, cancelModal_1.buildCancelModal)(parking),
            });
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.CancelParking = CancelParking;
