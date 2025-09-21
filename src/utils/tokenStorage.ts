/* eslint-disable @typescript-eslint/no-explicit-any */
import redis from '../configs/redis';

export const saveToken = async (userId: string, tokens: any) => {
  try {
    await redis.set(`fdtparking:google_token:${userId}`, JSON.stringify(tokens));
    console.log(`✅ Token saved for user: ${userId}`);
  } catch (err) {
    console.error('❌ Error saving token to Redis:', err);
    console.log('❌ Error saving token to Redis:', err);
  }
};

export const getToken = async (userId: string) => {
  try {
    const data = await redis.get(`fdtparking:google_token:${userId}`);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Error getting token from Redis:', err);
    return null;
  }
};
