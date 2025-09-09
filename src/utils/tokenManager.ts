import fs from 'fs';
import { TOKENS_PATH } from '../config/google';
import { oauth2Client } from '../config/google';

const readTokens = () =>
  fs.existsSync(TOKENS_PATH) ? JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8')) : {};

const writeTokens = (data: Record<string, unknown>) =>
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(data, null, 2));

export const tokenManager = {
  saveUserRefreshToken(slackUserId: string, refreshToken: string) {
    const tokens = readTokens();
    tokens[slackUserId] = { refresh_token: refreshToken };
    writeTokens(tokens);
  },

  getUserRefreshToken(slackUserId: string) {
    return readTokens()[slackUserId]?.refresh_token || null;
  },

  setCredentialsForUser(slackUserId: string) {
    const token = this.getUserRefreshToken(slackUserId);
    if (token) oauth2Client.setCredentials({ refresh_token: token });
  },

  async getTokenFromCode(code: string, slackUserId: string) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (tokens.refresh_token) {
      this.saveUserRefreshToken(slackUserId, tokens.refresh_token);
    }

    return tokens;
  },
};
