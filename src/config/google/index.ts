import { google } from 'googleapis';
import { ENV } from '../../utils/env';
import dotenv from 'dotenv';

dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_SECRET_ID,
  ENV.GOOGLE_REDIRECT_URI,
);

export const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export const getAuthUrl = (slackUserId: string) =>
  oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: slackUserId,
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setCredentials = (tokens: any) => {
  oauth2Client.setCredentials(tokens);
};

export const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
