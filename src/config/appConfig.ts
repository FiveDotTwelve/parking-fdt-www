import dotenv from 'dotenv';
import { ENV } from '../utils/env';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
}

const config: Config = {
  port: Number(ENV.PORT),
  nodeEnv: ENV.NODE_ENV,
};

export default config;
