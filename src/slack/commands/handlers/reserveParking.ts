import { RespondFn } from '@slack/bolt';
import { getToken } from '../../../utils/tokenStorage';
import { setCredentialsForUser } from '../../../config/google';
import { initialDate } from '../../../utils/getDate';
import { buildReservationModal } from '../../modals/reservationModal';
import { WebClient } from '@slack/web-api';

export const ReserveParkingHandler = async (user_id: string, client: WebClient, trigger_id: string, respond: RespondFn) => {
        if (!getToken(user_id)) {
          await respond({
            response_type: 'ephemeral',
            text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
          });
          return;
        }

        setCredentialsForUser(user_id);

        try {
          await client.views.open({
            trigger_id: trigger_id,
            view: buildReservationModal(initialDate),
          });
        } catch (error) {
          console.error(error);
        }
};
