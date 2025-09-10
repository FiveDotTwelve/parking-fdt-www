import { receiver } from './config/slack';
import { CommandManager } from './slack';
import authRouter from './routes';
import serverless from 'serverless-http';

receiver.app.use('/api', authRouter);

CommandManager();

receiver.app.get('/', async (req, res) => {
  res.send("Hello from Express on Vercel!");
});

export default serverless(receiver.app);