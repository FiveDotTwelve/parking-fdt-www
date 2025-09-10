"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    GOOGLE_CLIENT_ID: zod_1.z.string(),
    GOOGLE_SECRET_ID: zod_1.z.string(),
    GOOGLE_REDIRECT_URI: zod_1.z.string(),
    GOOGLE_CALENDAR_ID: zod_1.z.string(),
    SLACK_BOT_TOKEN: zod_1.z.string(),
    SLACK_SIGNING_SECRET: zod_1.z.string(),
});
exports.ENV = envSchema.parse(process.env);
