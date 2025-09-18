import { app, receiver } from './config/slack';
import { CommandManager } from './slack';
import authRouter from './routes';
import express from 'express';
import path from 'path';
import { ENV } from './utils/env';

receiver.app.use('/api', authRouter);

CommandManager();

receiver.app.use(express.static(path.join(__dirname, 'public')));
receiver.app.use(express.static(path.join(__dirname, 'views')));

(async () => {
  await app.start(ENV.PORT);
  console.log('⚡ FDTParkingBot running locally!');
  console.log(`Server running at http://localhost:${ENV.PORT}`);
})();

export default receiver.app;

