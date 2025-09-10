import { getAuthUrl } from '../../config/google';
import { app } from '../../config/slack';
import { getToken } from '../../utils/tokenStorage';

export function Login() {
  app.command('/login', async ({ command, ack, respond }) => {
    await ack();

    const refreshToken = getToken(command.user_id);

    if (!refreshToken) {
      await respond({
        response_type: 'ephemeral',
        text: `Hi ${command.user_name} 👋\nTo book a parking spot, please authorize your Google account first.\n👉 <${getAuthUrl(command.user_id)}|Click here to sign in with Google>`,
      });
    } else {
      await respond({
        response_type: 'ephemeral',
        text: `Hi ${command.user_name} ✅\nYour Google Calendar is already connected! You can now book parking spots directly.`,
      });
    }
  });
}
      // await respond({
      //   response_type: 'ephemeral',
      //   text: `Hi ${command.user_name} ✅\nYour Google Calendar is already connected! You can now book parking spots directly.`,
      // });
      //       await respond({
      //   response_type: 'ephemeral',
      //   text: `Hi ${command.user_name} 👋\nTo book a parking spot, please authorize your Google account first.\n👉 <${getAuthUrl(command.user_id)}|Click here to sign in with Google>`,
      // });