"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARKING_OPTIONS = void 0;
exports.PARKING_OPTIONS = [
    'FDT Parking 7',
    'FDT Parking 8',
    'FDT Parking 9',
    'FDT Parking MOL',
].map((spot) => ({
    text: { type: 'plain_text', text: spot, emoji: true },
    value: spot,
}));
