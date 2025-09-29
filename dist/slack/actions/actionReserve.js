"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionReserve = void 0;
const google_1 = require("../../configs/google");
const env_1 = require("../../utils/env");
const checkParkingTaken_1 = require("../lib/checkParkingTaken");
const ActionReserve = (app) => {
    app.view('submit_parking_reservation', async ({ body, ack }) => {
        const formValues = body.view.state.values;
        const userId = body.user.id;
        const today = new Date().toISOString().split('T')[0];
        const getValue = (actionId) => Object.values(formValues)
            .flatMap((block) => [
            block[actionId]?.selected_option?.value,
            block[actionId]?.selected_date,
        ])
            .find(Boolean);
        const selectedSpot = getValue('select_parking_spot');
        const selectedDate = getValue('parking_date');
        const isTaken = await (0, checkParkingTaken_1.CheckParkingTaken)(selectedSpot, selectedDate, userId);
        const dateBlockId = Object.keys(formValues).find((blockId) => formValues[blockId].parking_date);
        if (isTaken) {
            await ack({
                response_action: 'errors',
                errors: {
                    [dateBlockId || 'parking_date_block']: `Parking spot ${selectedSpot} is already booked for ${selectedDate}.`,
                },
            });
            return;
        }
        else if (selectedDate < today) {
            await ack({
                response_action: 'errors',
                errors: {
                    [dateBlockId || 'parking_date_block']: `You can't reserve a parking spot in the past.`,
                },
            });
            return;
        }
        try {
            await ack();
            await google_1.calendar.events.insert({
                calendarId: env_1.ENV.GOOGLE_CALENDAR_ID,
                requestBody: {
                    summary: selectedSpot,
                    start: {
                        date: selectedDate,
                    },
                    end: {
                        date: selectedDate,
                    },
                },
            });
            await app.client.chat.postMessage({
                channel: userId,
                text: `✅ - You have successfully reserved parking spot *${selectedSpot}* for *${selectedDate}*. `,
            });
        }
        catch {
            await app.client.chat.postMessage({
                channel: userId,
                text: `❌ - Failed to reserved for parking spot *${selectedSpot}* for *${selectedDate}*. Please try again. `,
            });
        }
    });
};
exports.ActionReserve = ActionReserve;
