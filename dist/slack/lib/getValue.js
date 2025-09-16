"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetValue = void 0;
const GetValue = (values, actionId) => {
    return Object.values(values)
        .map((block) => block[actionId]?.selected_option?.value || block[actionId]?.selected_date)
        .find(Boolean);
};
exports.GetValue = GetValue;
