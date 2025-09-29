"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionCancel = void 0;
const google_1 = require("../../configs/google");
const env_1 = require("../../utils/env");
const ActionCancel = (app) => {
    app.view('submit_parking_reservation_cancellation', async ({ body, ack }) => {
        const formValues = body.view.state.values;
        const userId = body.user.id;
        const getValue = (actionId) => Object.values(formValues)
            .flatMap((block) => [
            block[actionId]?.selected_option?.value,
            block[actionId]?.selected_date,
        ])
            .find(Boolean);
        const selectedSpotID = getValue('select_parkings_spots_date');
        const [id, summary, date] = selectedSpotID.split('_');
        try {
            await ack();
            await google_1.calendar.events.delete({
                calendarId: env_1.ENV.GOOGLE_CALENDAR_ID,
                eventId: id,
            });
            await app.client.chat.postMessage({
                channel: userId,
                text: `✅ - You have canceled your reservation for parking spot *${summary}* on *${date}*. `,
            });
        }
        catch {
            await app.client.chat.postMessage({
                channel: userId,
                text: `❌ - Failed to cancel your reservation for parking spot *${summary}* on *${date}*. Please try again.`,
            });
        }
    });
};
exports.ActionCancel = ActionCancel;
