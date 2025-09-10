import { receiver } from './config/slack';
import { CommandManager } from './slack';
import authRouter from './routes';

receiver.app.use('/api', authRouter);

CommandManager();

receiver.app.get('/api/hello', async (req, res) => {
  res.json({ message: 'Hello from Express on Vercel!' });
});

// (async () => {
//   const port = Number(ENV.PORT);
//   await app.start(port);
//   console.log(`⚡ FDTParkingBot running on port ${port}`);
// })();

export default receiver.app;

