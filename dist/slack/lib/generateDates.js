"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDates = generateDates;
function generateDates(start, end) {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}
