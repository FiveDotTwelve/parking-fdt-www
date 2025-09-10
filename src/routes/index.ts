import { oauth2Client } from '../config/google';
import { Router } from 'express';
import { readToken, saveToken } from '../utils/json';
import { app } from '../config/slack';

const authRouter = Router();

authRouter.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    const slackUserId = req.query.state as string;

    if (!code || !slackUserId) return res.status(400).json({ message: 'Missing code or state.' });

    const { tokens } = await oauth2Client.getToken(code);

    if (tokens.refresh_token) {
      const data = readToken();
      data[slackUserId] = { refreshToken: tokens.refresh_token };
      saveToken(data);
    }

    await app.client.chat.postMessage({
      channel: slackUserId,
      text: '✅ Google authorization successful! You can now book your parking spot directly from Slack.',
    });
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({ message: 'Error during Google authorization.' });
  }
});

export default authRouter;
