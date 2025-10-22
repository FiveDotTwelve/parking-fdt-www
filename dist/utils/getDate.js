"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitialDate = void 0;
const getInitialDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};
exports.getInitialDate = getInitialDate;
