"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiver = exports.app = void 0;
const bolt_1 = require("@slack/bolt");
const env_1 = require("../../utils/env");
const receiver = new bolt_1.ExpressReceiver({
    signingSecret: env_1.ENV.SLACK_SIGNING_SECRET,
    endpoints: {
        commands: '/slack/commands',
        actions: '/slack/actions',
    },
});
exports.receiver = receiver;
const app = new bolt_1.App({
    token: env_1.ENV.SLACK_BOT_TOKEN,
    receiver,
});
exports.app = app;
