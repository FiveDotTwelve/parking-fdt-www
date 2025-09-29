"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_1 = require("../configs/google");
const express_1 = require("express");
const tokenStorage_1 = require("../utils/tokenStorage");
const slack_1 = require("../configs/slack");
const authRouter = (0, express_1.Router)();
authRouter.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    const slackUserId = req.query.state;
    if (!code || !slackUserId) {
        return res.status(400).json({ message: 'Missing code or state.' });
    }
    try {
        const { tokens } = await google_1.oauth2Client.getToken(code);
        google_1.oauth2Client.setCredentials(tokens);
        if (tokens.refresh_token) {
            await (0, tokenStorage_1.saveToken)(slackUserId, tokens.refresh_token);
            await slack_1.app.client.chat.postMessage({
                channel: slackUserId,
                text: '✅ Google authorization successful! You can now book, check, and cancel your parking spot directly from Slack.',
            });
            return res.redirect('/views/auth-success.html');
        }
        await slack_1.app.client.chat.postMessage({
            channel: slackUserId,
            text: '✅ Google authorization successful! You can now book, check, and cancel your parking spot directly from Slack.',
        });
        res.redirect('/views/auth-success.html');
    }
    catch (error) {
        console.error('Google OAuth callback error full:', error);
        await slack_1.app.client.chat.postMessage({
            channel: slackUserId,
            text: '❌ Google authorization failed. You cannot book, check, or cancel your parking spot from Slack.',
        });
        res.redirect('/views/auth-failed.html');
    }
});
exports.default = authRouter;
