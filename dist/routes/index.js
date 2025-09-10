"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_1 = require("../config/google");
const express_1 = require("express");
const json_1 = require("../utils/json");
const slack_1 = require("../config/slack");
const authRouter = (0, express_1.Router)();
authRouter.get('/auth/google/callback', async (req, res) => {
    try {
        const code = req.query.code;
        const slackUserId = req.query.state;
        if (!code || !slackUserId)
            return res.status(400).json({ message: 'Missing code or state.' });
        const { tokens } = await google_1.oauth2Client.getToken(code);
        if (tokens.refresh_token) {
            const data = (0, json_1.readToken)();
            data[slackUserId] = { refreshToken: tokens.refresh_token };
            (0, json_1.saveToken)(data);
        }
        await slack_1.app.client.chat.postMessage({
            channel: slackUserId,
            text: '✅ Google authorization successful! You can now book your parking spot directly from Slack.',
        });
    }
    catch (error) {
        console.error('Google OAuth callback error:', error);
        res.status(500).json({ message: 'Error during Google authorization.' });
    }
});
exports.default = authRouter;
