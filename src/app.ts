import { app,receiver } from './config/slack';
import { CommandManager } from './slack';
import authRouter from './routes';

receiver.app.use('/api', authRouter);

CommandManager();

receiver.app.get('/api/hello', async (req, res) => {
  res.send('Hello World');
});


(async () => {
  await app.start(process.env.PORT || 5000);
  console.log('⚡ FDTParkingBot bot running with ExpressReceiver!');
})();
