import { App, ExpressReceiver } from "@slack/bolt";
import { ENV } from "./utils/env";

const receiver = new ExpressReceiver({
  signingSecret: ENV.SLACK_SIGNING_SECRET,
  endpoints: '/slack/commands',
});

const app = new App({
  token: ENV.SLACK_BOT_TOKEN,
  receiver,
});


// receiver.app.post('/slack/commands', (req, res) => {
//   console.log('Slash command received!', req.body);
//   res.send('✅ Otrzymano komendę!');
// });

// app.command('/hello', async ({ command, ack, respond }) => {
//   await ack();
//   await respond({
//     response_type: 'ephemeral',
//     text: `Cześć <@${command.user_id}>! :wave: Miło Cię widzieć!`,
//   });
// });

(async () => {
  await app.start(process.env.PORT || 5000);
  console.log('⚡ FDTParkingBot  bot running with ExpressReceiver!');
})();
