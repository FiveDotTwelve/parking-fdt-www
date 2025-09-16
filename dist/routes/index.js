"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_1 = require("../config/google");
const express_1 = require("express");
const tokenStorage_1 = require("../utils/tokenStorage");
const slack_1 = require("../config/slack");
const authRouter = (0, express_1.Router)();
authRouter.get('/auth/google/callback', async (req, res) => {
    try {
        const code = req.query.code;
        const slackUserId = req.query.state;
        if (!code || !slackUserId) {
            return res.status(400).json({ message: 'Missing code or state.' });
        }
        // console.log('🔹 Received code:', code);
        // console.log('🔹 Received state (Slack user ID):', slackUserId);
        // const { tokens } = await oauth2Client.getToken(code).catch((err) => {
        //   console.error('❌ - Error getting tokens from Google:', err.response?.data || err);
        //   throw err;
        // });
        const { tokens } = await google_1.oauth2Client.getToken(code);
        google_1.oauth2Client.setCredentials(tokens);
        if (tokens.refresh_token) {
            await (0, tokenStorage_1.saveToken)(slackUserId, tokens.refresh_token);
        }
        else
            return;
        await slack_1.app.client.chat.postMessage({
            channel: slackUserId,
            text: '✅ - Google authorization successful! You can now book your parking spot directly from Slack.',
        });
        // res.status(200).json({ message: 'Authorization successful' });
        res.render('auth-success.ejs', { url: req.protocol + '://' + req.headers.host });
    }
    catch {
        // console.error('Google OAuth callback error full:', error);
        res.render('auth-failed.ejs', { url: req.protocol + '://' + req.headers.host });
    }
});
exports.default = authRouter;
