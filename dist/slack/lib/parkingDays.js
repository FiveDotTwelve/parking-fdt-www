"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParkingNext = exports.ParkingWeek = exports.ParkingToday = void 0;
const parkingSlots_1 = require("../constants/parkingSlots");
const convertEvent_1 = __importDefault(require("./convertEvent"));
const google_1 = require("../../configs/google");
const env_1 = require("../../utils/env");
const tokenStorage_1 = require("../../utils/tokenStorage");
const getDate_1 = require("../../utils/getDate");
const dateUtils_1 = require("../../utils/dateUtils");
const ParkingToday = async (user_id, respond) => {
    console.log('user_id', user_id);
    if (!(await (0, tokenStorage_1.getToken)(user_id))) {
        await respond({
            response_type: 'ephemeral',
            text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
        });
        return;
    }
    else {
        await (0, google_1.setCredentialsForUser)(user_id);
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setDate(end.getDate() + 1);
        const { data } = await google_1.calendar.events.list({
            calendarId: env_1.ENV.GOOGLE_CALENDAR_ID,
            singleEvents: true,
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            orderBy: 'startTime',
        });
        console.log('calendar.events.list', data);
        const todayDate = start.toISOString().split('T')[0];
        const takenSlots = new Set((data.items || [])
            .map(convertEvent_1.default)
            .filter((e) => e.start === todayDate)
            .map((e) => e.summary));
        const parkingColumn = '*Parking:*\n' + parkingSlots_1.PARKING_SLOTS.join('\n');
        const statusColumn = '*Status:*\n' +
            parkingSlots_1.PARKING_SLOTS.map((slot) => (takenSlots.has(slot) ? '[❌]' : '[✅]')).join('\n');
        console.log('statusColumn', statusColumn);
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
                                        {
                                            type: 'text',
                                            text: 'List of available and taken parking slot on ',
                                        },
                                        { type: 'text', text: (0, getDate_1.getInitialDate)(), style: { bold: true } },
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
exports.ParkingToday = ParkingToday;
const ParkingWeek = async (user_id, respond) => {
    if (!(await (0, tokenStorage_1.getToken)(user_id))) {
        await respond({
            response_type: 'ephemeral',
            text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
        });
        return;
    }
    else {
        await (0, google_1.setCredentialsForUser)(user_id);
        const { start, end } = (0, dateUtils_1.GetWeek)(new Date());
        const { data } = await google_1.calendar.events.list({
            calendarId: env_1.ENV.GOOGLE_CALENDAR_ID,
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });
        const today = new Date().toISOString().split('T')[0];
        const dates = (0, dateUtils_1.generateDates)(start, end);
        console.log('dates', dates);
        console.log('start, end', start, end);
        const takenDays = (slot) => {
            return (data.items || [])
                .map(convertEvent_1.default)
                .filter((a) => a.summary === slot)
                .map((a) => a.start)
                .filter(Boolean);
        };
        const statusLines = (parkings_days) => {
            console.log('parkings_days', parkings_days);
            return dates
                .map((date) => {
                console.log('date: ', date, 'today: ', today, parkings_days.includes(date));
                if (date < today)
                    return '[❌]';
                return parkings_days.includes(date) ? '[❌]' : '[✅]';
            })
                .join(' ');
        };
        const statusColumn = '[PON][WT][ŚR][CZW][PT]\n' +
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
                                        {
                                            type: 'text',
                                            text: `List of available and taken parking slot this `,
                                        },
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
exports.ParkingWeek = ParkingWeek;
const ParkingNext = async (user_id, respond) => {
    if (!(await (0, tokenStorage_1.getToken)(user_id))) {
        await respond({
            response_type: 'ephemeral',
            text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
        });
        return;
    }
    else {
        await (0, google_1.setCredentialsForUser)(user_id);
        const { nextMonday, nextFriday } = (0, dateUtils_1.getNextWeekRange)();
        console.log('nextMonday.toISOString()', nextMonday.toISOString());
        console.log('nextFriday.toISOString()', nextFriday.toISOString());
        const dates = (0, dateUtils_1.generateWorkweekDates)(nextMonday);
        // Extend timeMin by one day back to catch all-day events starting on Monday
        const timeMin = new Date(nextMonday);
        timeMin.setDate(timeMin.getDate() - 1);
        // Extend timeMax by one day forward to catch all-day events ending on Friday
        const timeMax = new Date(nextFriday);
        timeMax.setDate(timeMax.getDate() + 1);
        const { data } = await google_1.calendar.events.list({
            calendarId: env_1.ENV.GOOGLE_CALENDAR_ID,
            singleEvents: true,
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            timeZone: 'Europe/Warsaw',
            orderBy: 'startTime',
        });
        const events = (data.items || []).map(convertEvent_1.default);
        const takenDays = (slot, events) => {
            return events.filter((a) => a.summary === slot).map((a) => a.start);
        };
        const statusLines = (dates, taken) => dates.map((d) => (taken.includes(d) ? '[❌]' : '[✅]')).join(' ');
        const parkingColumn = '*Parking:*\n' + parkingSlots_1.PARKING_SLOTS.join('\n');
        const statusColumn = '[PON][WT][ŚR][CZW][PT]\n' +
            parkingSlots_1.PARKING_SLOTS.map((slot) => statusLines(dates, takenDays(slot, events))).join('\n');
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
                                        {
                                            type: 'text',
                                            text: `List of available and taken parking slot this `,
                                        },
                                        {
                                            type: 'text',
                                            text: `${nextMonday.toLocaleDateString('pl-PL')} - ${nextFriday.toLocaleDateString('pl-PL')}`,
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
exports.ParkingNext = ParkingNext;
