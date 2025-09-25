import { app, receiver } from './configs/slack';
import { SlackApp } from './slack';
import authRouter from './routes';
import express from 'express';
import path from 'path';
import { ENV } from './utils/env';
import redis from './configs/redis';

receiver.app.use('/api', authRouter);
receiver.app.use(express.static(path.join(__dirname, 'public')));

SlackApp();

receiver.app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

(async () => {
  await app.start(ENV.PORT);
  console.log('⚡ FDTParking running locally!');
  console.log(`Server running at http://localhost:${ENV.PORT}`);
  redis.on('connect', () => {
    console.log('✅ Connected to Redis');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis error:', err);
  });
})();

export default receiver.app;
