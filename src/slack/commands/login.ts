import { getAuthUrl } from '../../config/google';
import { tokenManager } from '../../utils/tokenManager';
import { app } from '../../config/slack';

export function Login() {
  app.command('/login', async ({ command, ack, respond }) => {
    await ack(); 
    const slackUserId = command.user_id;
    const isAuthorized = !!tokenManager.getUserRefreshToken(slackUserId);

    if (!isAuthorized) {
      await respond({
        response_type: 'ephemeral',
        text: `Hi ${command.user_name} 👋\nTo book a parking spot, please authorize your Google account first.\n👉 <${getAuthUrl(slackUserId)}|Click here to sign in with Google>`,
      });
    } else {
      await respond({
        response_type: 'ephemeral',
        text: `Hi ${command.user_name} ✅\nYour Google Calendar is already connected! You can now book parking spots directly.`,
      });
    }
  });
}
