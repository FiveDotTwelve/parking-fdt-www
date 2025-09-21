import { google } from 'googleapis';
import { ENV } from '../utils/env';
import dotenv from 'dotenv';
import path from 'path';
import { getToken } from '../utils/tokenStorage';
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

export const setCredentialsForUser = async (slackUserId: string) => {
  const token = await getToken(slackUserId);
  if (!token) return;

  if (typeof token === 'string') {
    oauth2Client.setCredentials({ refresh_token: token });
  } else {
    oauth2Client.setCredentials(token);
  }
};

export const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
