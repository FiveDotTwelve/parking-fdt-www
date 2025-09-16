"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = convertCalendarEvent;
function convertCalendarEvent(ev) {
    const startDate = ev.start?.date || ev.start?.dateTime?.slice(0, 10);
    return {
        summary: ev.summary ?? undefined,
        start: startDate,
        end: startDate,
        status: ev.transparency === 'transparent',
    };
}
