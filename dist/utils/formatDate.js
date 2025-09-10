"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDatePL = formatDatePL;
function formatDatePL(date) {
    if (!date)
        return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}
