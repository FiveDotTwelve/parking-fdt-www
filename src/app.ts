import { app, receiver } from "./config/slack";
import { authRouter } from "./routes";
import { CommandManager } from "./slack";


receiver.app.use('/api', authRouter);

CommandManager.login();
CommandManager.show();

(async () => {
  await app.start(process.env.PORT || 5000);
  console.log('⚡ FDTParkingBot bot running with ExpressReceiver!');
})();
