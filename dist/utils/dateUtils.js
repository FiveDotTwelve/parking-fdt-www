"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDates = exports.generateWorkweekDates = exports.getNextWeekRange = exports.GetWeek = void 0;
const GetWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(12, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 4);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};
exports.GetWeek = GetWeek;
const getNextWeekRange = () => {
    const today = new Date();
    const day = today.getDay();
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
    mondayThisWeek.setHours(0, 0, 0, 0);
    const nextMonday = new Date(mondayThisWeek);
    nextMonday.setDate(mondayThisWeek.getDate() + 7);
    const nextFriday = new Date(nextMonday);
    nextFriday.setDate(nextMonday.getDate() + 4);
    nextFriday.setHours(23, 59, 59, 999);
    return { nextMonday, nextFriday };
};
exports.getNextWeekRange = getNextWeekRange;
const generateWorkweekDates = (monday) => Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday.getTime());
    d.setDate(monday.getDate() + i);
    d.setHours(12, 0, 0, 0);
    return d.toISOString().split('T')[0];
});
exports.generateWorkweekDates = generateWorkweekDates;
const generateDates = (start, end) => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
};
exports.generateDates = generateDates;
