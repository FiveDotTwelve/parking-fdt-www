"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggedUser = exports.calendar = exports.setCredentialsForUser = exports.getAuthUrl = exports.SCOPES = exports.oauth2Client = void 0;
const googleapis_1 = require("googleapis");
const env_1 = require("../utils/env");
const dotenv_1 = __importDefault(require("dotenv"));
const tokenStorage_1 = require("../utils/tokenStorage");
dotenv_1.default.config();
exports.oauth2Client = new googleapis_1.google.auth.OAuth2(env_1.ENV.GOOGLE_CLIENT_ID, env_1.ENV.GOOGLE_SECRET_ID, env_1.ENV.GOOGLE_REDIRECT_URI);
exports.SCOPES = ['https://www.googleapis.com/auth/calendar'];
const getAuthUrl = (slackUserId) => exports.oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: exports.SCOPES,
    prompt: 'consent',
    state: slackUserId,
});
exports.getAuthUrl = getAuthUrl;
const setCredentialsForUser = async (slackUserId) => {
    const token = await (0, tokenStorage_1.getToken)(slackUserId);
    console.log('token', token);
    console.log('slackUserId', slackUserId);
    if (!token)
        return;
    if (typeof token === 'string') {
        exports.oauth2Client.setCredentials({ refresh_token: token });
    }
    else {
        exports.oauth2Client.setCredentials(token);
    }
};
exports.setCredentialsForUser = setCredentialsForUser;
exports.calendar = googleapis_1.google.calendar({ version: 'v3', auth: exports.oauth2Client });
const getLoggedUser = async (slackUserId) => {
    await (0, exports.setCredentialsForUser)(slackUserId);
    const calendarList = await exports.calendar.calendarList.get({
        calendarId: 'primary',
    });
    return {
        email: calendarList.data.id,
        summary: calendarList.data.summary,
    };
};
exports.getLoggedUser = getLoggedUser;
