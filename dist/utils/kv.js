"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCredentials = exports.readToken = exports.saveToken = void 0;
const kv_1 = require("@vercel/kv");
// Zapis tokena dla użytkownika
const saveToken = async (slackUserId, token) => {
    await kv_1.kv.set(`token:${slackUserId}`, token);
};
exports.saveToken = saveToken;
// Odczyt tokena dla użytkownika
const readToken = async (slackUserId) => {
    const token = await kv_1.kv.get(`token:${slackUserId}`);
    return token || {};
};
exports.readToken = readToken;
// Sprawdzenie, czy użytkownik ma token
const checkCredentials = async (slackUserId) => {
    const userToken = (await (0, exports.readToken)(slackUserId));
    return Boolean(userToken?.refresh_token);
};
exports.checkCredentials = checkCredentials;
