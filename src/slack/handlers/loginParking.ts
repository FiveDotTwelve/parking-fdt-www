import { RespondFn } from '@slack/bolt';
import { getToken } from '../../utils/tokenStorage';
import { getAuthUrl } from '../../configs/google';

export const LoginParking = async (user_id: string, user_name: string, respond: RespondFn) => {
  const refreshToken = await getToken(user_id);

  if (!refreshToken) {
    await respond({
      response_type: 'ephemeral',
      text: `Hi ${user_name} 👋\nBooking, checking, and canceling a parking spot requires Google account authorization. Please sign in with your Google account first.\n👉 <${getAuthUrl(user_id)}|Click here to sign in with Google>`,
    });
  } else {
    await respond({
      response_type: 'ephemeral',
      text: `Hi ${user_name} ✅\nYour Google Calendar is already connected! You can now book, check, and cancel parking spots directly.`,
    });
  }
};
