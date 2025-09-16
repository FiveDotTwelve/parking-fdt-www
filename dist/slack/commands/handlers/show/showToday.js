"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showToday = void 0;
const google_1 = require("../../../../config/google");
const parkingSlots_1 = require("../../../constants/parkingSlots");
const convertEvent_1 = __importDefault(require("../../../lib/convertEvent"));
const getDate_1 = require("../../../../utils/getDate");
const env_1 = require("../../../../utils/env");
const tokenStorage_1 = require("../../../../utils/tokenStorage");
const showToday = async (user_id, respond) => {
    if (!(0, tokenStorage_1.getToken)(user_id)) {
        await respond({
            response_type: 'ephemeral',
            text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
        });
        return;
    }
    else {
        (0, google_1.setCredentialsForUser)(user_id);
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const { data } = await google_1.calendar.events.list({
            calendarId: env_1.ENV.GOOGLE_CALENDAR_ID,
            singleEvents: true,
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            orderBy: 'startTime',
        });
        const takenSlots = new Set((data.items || []).map(convertEvent_1.default).map((e) => e.summary));
        const parkingColumn = '*Parking:*\n' + parkingSlots_1.PARKING_SLOTS.join('\n');
        const statusColumn = '*Status:*\n' +
            parkingSlots_1.PARKING_SLOTS.map((slot) => (takenSlots.has(slot) ? '[❌]' : '[✅]')).join('\n');
        await respond({
            response_type: 'in_channel',
            attachments: [
                {
                    color: '#E42930',
                    blocks: [
                        {
                            type: 'rich_text',
                            elements: [
                                {
                                    type: 'rich_text_section',
                                    elements: [
                                        { type: 'text', text: 'List of available and taken parking slot on ' },
                                        { type: 'text', text: getDate_1.initialDate, style: { bold: true } },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'section',
                            fields: [
                                { type: 'mrkdwn', text: parkingColumn },
                                { type: 'mrkdwn', text: statusColumn },
                            ],
                        },
                        { type: 'divider' },
                    ],
                },
            ],
        });
    }
};
exports.showToday = showToday;
