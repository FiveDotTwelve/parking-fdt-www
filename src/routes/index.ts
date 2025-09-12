import { oauth2Client } from '../config/google';
import { Router } from 'express';
import { saveToken } from '../utils/tokenStorage';
import { app } from '../config/slack';

const authRouter = Router();

authRouter.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    const slackUserId = req.query.state as string;

    if (!code || !slackUserId) {
      return res.status(400).json({ message: 'Missing code or state.' });
    }

    // console.log('🔹 Received code:', code);
    // console.log('🔹 Received state (Slack user ID):', slackUserId);

    // const { tokens } = await oauth2Client.getToken(code).catch((err) => {
    //   console.error('❌ - Error getting tokens from Google:', err.response?.data || err);
    //   throw err;
    // });

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    if (tokens.refresh_token) {
      await saveToken(slackUserId, tokens.refresh_token);
    } else return;

    await app.client.chat.postMessage({
      channel: slackUserId,
      text: '✅ - Google authorization successful! You can now book your parking spot directly from Slack.',
    });

    // res.status(200).json({ message: 'Authorization successful' });
    res.render('auth-success.ejs', {url:req.protocol+"://"+req.headers.host})
    
  } catch (error) {
    console.error('Google OAuth callback error full:', error);
    res.status(500).json({ message: 'Error during Google authorization.', error: error });
  }
});

export default authRouter;
