"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.saveToken = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const TOKEN_PATH = path_1.default.join(__dirname, '../config/google/tokens.json');
const saveToken = (userId, tokens) => {
    let data = {};
    if (fs_1.default.existsSync(TOKEN_PATH)) {
        data = JSON.parse(fs_1.default.readFileSync(TOKEN_PATH, 'utf8'));
    }
    data[userId] = tokens;
    fs_1.default.writeFileSync(TOKEN_PATH, JSON.stringify(data, null, 2));
};
exports.saveToken = saveToken;
const getToken = (userId) => {
    if (!fs_1.default.existsSync(TOKEN_PATH))
        return null;
    const data = JSON.parse(fs_1.default.readFileSync(TOKEN_PATH, 'utf8'));
    return data[userId] || null;
};
exports.getToken = getToken;
