"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendar = exports.getAuthUrl = exports.TOKEN_PATH = exports.SCOPES = exports.oauth2Client = void 0;
const googleapis_1 = require("googleapis");
const env_1 = require("../../utils/env");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
exports.oauth2Client = new googleapis_1.google.auth.OAuth2(env_1.ENV.GOOGLE_CLIENT_ID, env_1.ENV.GOOGLE_SECRET_ID, env_1.ENV.GOOGLE_REDIRECT_URI);
exports.SCOPES = ['https://www.googleapis.com/auth/calendar'];
exports.TOKEN_PATH = path_1.default.join(__dirname, 'tokens.json');
const getAuthUrl = (slackUserId) => exports.oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: exports.SCOPES,
    prompt: 'consent',
    state: slackUserId,
});
exports.getAuthUrl = getAuthUrl;
exports.calendar = googleapis_1.google.calendar({ version: 'v3', auth: exports.oauth2Client });
