import { RespondFn } from "@slack/bolt";
import { getToken } from "../../utils/tokenStorage";
import { setCredentialsForUser } from "../../config/google";

export const CheckAuth = async (user_id: string, respond: RespondFn) => {
      if (!getToken(user_id)) {
        await respond({
          response_type: 'ephemeral',
          text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
        });
        return;
      }
    
      return setCredentialsForUser(user_id);
}