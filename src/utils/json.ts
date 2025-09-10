import { TOKEN_PATH } from '../config/google';
import fs from 'fs';

export const readToken = () => {
  if (!fs.existsSync(TOKEN_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  } catch {
    return {};
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveToken = (data: any) => {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(data, null, 2));
};

export const checkCredentials = (slackUserId: string) => {
  const tokens = readToken();
  const userToken = tokens[slackUserId]?.refresh_token;
  return Boolean(userToken);
};
