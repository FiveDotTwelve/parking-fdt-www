import { receiver } from './config/slack';
import { CommandManager } from './slack';
import authRouter from './routes';
import { ENV } from './utils/env';
import express from 'express';
import path from 'path';
import serverless from 'serverless-http';

receiver.app.use('/api', authRouter);

CommandManager();

receiver.app.use(express.static(path.join(__dirname, 'public')));


receiver.app.set('views', path.join(__dirname, 'views'));
receiver.app.set('view engine', 'ejs');

receiver.app.get('/', async (req, res) => {
  res.render('auth-success.ejs', { url: req.protocol + '://' + req.headers.host });
});

// (async () => {
//   await app.start(ENV.PORT);
//   console.log('⚡ FDTParkingBot bot running with ExpressReceiver!');
// })();

receiver.app.listen(ENV.PORT, () => {
  console.log(`Server running at http://localhost:${ENV.PORT}`);
})

export const handler = serverless(receiver.app);
