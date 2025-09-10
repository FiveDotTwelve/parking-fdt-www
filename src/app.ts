import { app,receiver } from './config/slack';
import { CommandManager } from './slack';
import authRouter from './routes';
import { ENV } from './utils/env';

receiver.app.use('/api', authRouter);

CommandManager();

(async () => {
  await app.start(ENV.PORT);
  console.log('⚡ FDTParkingBot bot running with ExpressReceiver!');
})();
