import { RespondFn } from '@slack/bolt';
import { getToken } from '../../../utils/tokenStorage';
import { getAuthUrl } from '../../../config/google';

export const LoginParkingHandler = async (
  user_id: string,
  user_name: string,
  respond: RespondFn,
) => {
  const refreshToken = getToken(user_id);

  if (!refreshToken) {
    await respond({
      response_type: 'ephemeral',
      text: `Hi ${user_name} 👋\nTo book a parking spot, please authorize your Google account first.\n👉 <${getAuthUrl(user_id)}|Click here to sign in with Google>`,
    });
  } else {
    await respond({
      response_type: 'ephemeral',
      text: `Hi ${user_name} ✅\nYour Google Calendar is already connected! You can now book parking spots directly.`,
    });
  }
};
