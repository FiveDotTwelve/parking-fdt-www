import { oauth2Client } from '../config/google';
import { receiver } from '../config/slack';
import { Router } from 'express';

const authRouter = Router();

authRouter.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    const slackUserId = req.query.state as string;

    if (!code || !slackUserId) return res.status(400).json({ message: 'Missing code or state.' });
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({ message: 'Error during Google authorization.' });
  }
});

export default authRouter;
