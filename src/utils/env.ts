import { z } from 'zod';

import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_SECRET_ID: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_CALENDAR_ID: z.string(),
  SLACK_BOT_TOKEN: z.string(),
  SLACK_SIGNING_SECRET: z.string(),
  PORT: z.string(),
  NODE_ENV: z.string(),
  SLACK_APP_TOKEN: z.string(),
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
