import { app,receiver } from './config/slack';
import { CommandManager } from './slack';
import authRouter from './routes';
import { ENV } from './utils/env';

receiver.app.use('/api', authRouter);

CommandManager();

receiver.app.get('/api/hello', async (req, res) => {
  res.send('Hello from Express');
});

(async () => {
  await app.start(ENV.PORT);
  console.log('⚡ FDTParkingBot bot running with ExpressReceiver!');
})();
