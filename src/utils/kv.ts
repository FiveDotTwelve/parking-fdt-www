import { kv } from '@vercel/kv';
import { GoogleToken } from '../types/google';

// Zapis tokena dla użytkownika
export const saveToken = async (slackUserId: string, token: GoogleToken) => {
  await kv.set(`token:${slackUserId}`, token);
};

// Odczyt tokena dla użytkownika
export const readToken = async (slackUserId: string) => {
  const token = await kv.get(`token:${slackUserId}`);
  return token || {};
};

// Sprawdzenie, czy użytkownik ma token
export const checkCredentials = async (slackUserId: string) => {
  const userToken = (await readToken(slackUserId)) as GoogleToken;
  return Boolean(userToken?.refresh_token);
};
