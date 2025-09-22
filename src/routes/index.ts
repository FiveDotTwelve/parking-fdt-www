import { oauth2Client } from '../configs/google';
import { Router } from 'express';
import { saveToken } from '../utils/tokenStorage';
import { app } from '../configs/slack';
import path from 'path';

const authRouter = Router();

authRouter.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code as string;
  const slackUserId = req.query.state as string;

  if (!code || !slackUserId) {
    return res.status(400).json({ message: 'Missing code or state.' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    if (tokens.refresh_token) {
      await saveToken(slackUserId, tokens.refresh_token);
      return;
    }

    await app.client.chat.postMessage({
      channel: slackUserId,
      text: '✅ Google authorization successful! You can now book, check, and cancel your parking spot directly from Slack.',
    });

    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'auth-success.html'));
  } catch (error) {
    console.error('Google OAuth callback error full:', error);

    await app.client.chat.postMessage({
      channel: slackUserId,
      text: '❌ Google authorization failed. You cannot book, check, or cancel your parking spot from Slack.',
    });

    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'auth-failed.html'));
  }
});

export default authRouter;
