"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWeek = void 0;
const GetWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay() || 5;
    start.setDate(start.getDate() - (day - 1));
    const end = new Date(start);
    end.setDate(start.getDate() + 4);
    return { start, end };
};
exports.GetWeek = GetWeek;
