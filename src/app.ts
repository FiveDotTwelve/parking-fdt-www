import { app, receiver } from './config/slack';
import { CommandManager } from './slack';
import authRouter from './routes';
import { ENV } from './utils/env';
// import express from 'express';
// import path from 'path';
import serverless from 'serverless-http';

receiver.app.use('/api', authRouter);

CommandManager();

// receiver.app.use(express.static(path.join(__dirname, 'public')));


// receiver.app.set('views', path.join(__dirname, 'views'));
// receiver.app.set('view engine', 'ejs');

receiver.app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API działa!' });

});

if (ENV.NODE_ENV !== 'production') {
  (async () => {
    await app.start(ENV.PORT);
    console.log('⚡ FDTParkingBot running locally!');
    console.log(`Server running at http://localhost:${ENV.PORT}`);
  })();
}

export const handler = serverless(receiver.app);
