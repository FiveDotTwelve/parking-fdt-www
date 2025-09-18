import { ENV } from './../../utils/env';
import Redis from 'ioredis';

const redis = new Redis(ENV.REDIS_URL); 

export default redis;
