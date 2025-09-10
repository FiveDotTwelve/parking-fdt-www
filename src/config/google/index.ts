import { google } from 'googleapis';
import { ENV } from '../../utils/env';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_SECRET_ID,
  ENV.GOOGLE_REDIRECT_URI,
);

export const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export const TOKEN_PATH = path.join(__dirname, 'tokens.json');

export const getAuthUrl = (slackUserId: string) =>
  oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: slackUserId,
  });

export const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
