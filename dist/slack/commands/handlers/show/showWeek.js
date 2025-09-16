"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showWeek = void 0;
const google_1 = require("../../../../config/google");
const parkingSlots_1 = require("../../../constants/parkingSlots");
const convertEvent_1 = __importDefault(require("../../../lib/convertEvent"));
const env_1 = require("../../../../utils/env");
const getWeek_1 = require("../../../lib/getWeek");
const generateDates_1 = require("../../../lib/generateDates");
const tokenStorage_1 = require("../../../../utils/tokenStorage");
const showWeek = async (user_id, respond) => {
    if (!(0, tokenStorage_1.getToken)(user_id)) {
        await respond({
            response_type: 'ephemeral',
            text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
        });
        return;
    }
    else {
        (0, google_1.setCredentialsForUser)(user_id);
        const { start, end } = (0, getWeek_1.GetWeek)(new Date());
        const { data } = await google_1.calendar.events.list({
            calendarId: env_1.ENV.GOOGLE_CALENDAR_ID,
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });
        const today = new Date().toISOString().split('T')[0];
        const dates = (0, generateDates_1.generateDates)(start, end);
        const takenDays = (slot) => {
            return (data.items || [])
                .map(convertEvent_1.default)
                .filter((a) => a.summary === slot)
                .map((a) => a.start)
                .filter(Boolean);
        };
        const statusLines = (parkings_days) => {
            return dates
                .map((date) => {
                if (date < today)
                    return '[❌]';
                return parkings_days.includes(date) ? '[❌]' : '[✅]';
            })
                .join(' ');
        };
        const statusColumn = '*Status:*\n' +
            parkingSlots_1.PARKING_SLOTS.map((slot) => {
                const parkings_days = takenDays(slot);
                return statusLines(parkings_days);
            }).join('\n');
        const parkingColumn = '*Parking:*\n' + parkingSlots_1.PARKING_SLOTS.join('\n');
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
                                        { type: 'text', text: `List of available and taken parking slot this ` },
                                        {
                                            type: 'text',
                                            text: `${start.toLocaleDateString('pl-PL')} - ${end.toLocaleDateString('pl-PL')}`,
                                            style: { bold: true },
                                        },
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
exports.showWeek = showWeek;
