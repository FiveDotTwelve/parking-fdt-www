import { Router } from 'express';
import { getTokenFromCode } from '../../config/google';

const authRouter = Router();

authRouter.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).json({ message: 'No authorization code in the query.' });

    const tokens = await getTokenFromCode(code);

    console.log('Tokens obtained:', {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ? 'SAVED' : 'NOT SAVED',
    });

    res.redirect('/');
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({ message: 'Error during Google authorization.' });
  }
});

export default authRouter;
