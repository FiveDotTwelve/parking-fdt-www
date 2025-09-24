import { RespondFn } from '@slack/bolt';
import { setCredentialsForUser } from '../../../configs/google';
import { getToken } from '../../../utils/tokenStorage';
import { buildReservationModal } from '../../modals/reservationModal';
import { initialDate } from '../../../utils/getDate';
import { WebClient } from '@slack/web-api';

export const ReserveParking = async (
  user_id: string,
  client: WebClient,
  trigger_id: string,
  respond: RespondFn,
) => {
  if (!(await getToken(user_id))) {
    await respond({
      response_type: 'ephemeral',
      text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
    });
    return;
  } else {
    await setCredentialsForUser(user_id);

    try {
      await client.views.open({
        trigger_id: trigger_id,
        view: buildReservationModal(initialDate),
      });
    } catch (error) {
      console.error(error);
    }
  }
};
