import fs from 'fs';
import { TOKENS_PATH } from '../config/google';
import { oauth2Client } from '../config/google';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readTokens = (): Record<string, any> => 
  fs.existsSync(TOKENS_PATH) 
    ? JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8')) 
    : {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const writeTokens = (data: Record<string, any>) =>
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(data, null, 2));

export const tokenManager = {
  saveUserRefreshToken: (slackUserId: string, refreshToken: string) => {
    const data = readTokens();
    data[slackUserId] = { refresh_token: refreshToken };
    writeTokens(data);
  },

  getUserRefreshToken: (slackUserId: string) => 
    readTokens()[slackUserId]?.refresh_token || null,

  setCredentialsForUser: (slackUserId: string) => {
    const token = tokenManager.getUserRefreshToken(slackUserId);
    if (token) oauth2Client.setCredentials({ refresh_token: token });
  },

  getTokenFromCode: async (code: string, slackUserId: string) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    if (tokens.refresh_token) {
      tokenManager.saveUserRefreshToken(slackUserId, tokens.refresh_token);
    }
    return tokens;
  }
};
