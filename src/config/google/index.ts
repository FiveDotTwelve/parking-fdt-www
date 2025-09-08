import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { ENV } from '../../utils/env';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_SECRET_ID,
  ENV.GOOGLE_REDIRECT_URI,
);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKENS_PATH = path.join(__dirname, 'tokens.json');

export const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

export const saveRefreshToken = (refreshToken: string) =>
  fs.writeFileSync(TOKENS_PATH, JSON.stringify({ refreshToken }, null, 2));

export const getRefreshToken = (): string | null => {
  if (!fs.existsSync(TOKENS_PATH)) return null;
  return JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8')).refreshToken || null;
};

export const setCredentialsFromFile = () => {
  const refreshToken = getRefreshToken();
  if (refreshToken) oauth2Client.setCredentials({ refresh_token: refreshToken });
};

export const getTokenFromCode = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  if (tokens.refresh_token) saveRefreshToken(tokens.refresh_token);
  return tokens;
};

export const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
