"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialDate = void 0;
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
exports.initialDate = `${yyyy}-${mm}-${dd}`;
