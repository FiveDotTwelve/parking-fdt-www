import { RespondFn } from '@slack/bolt';
import { initialDate } from '../../../utils/getDate';
import { buildReservationModal } from '../../modals/reservationModal';
import { WebClient } from '@slack/web-api';
import { CheckAuth } from '../../utils/checkAuth';

export const ReserveParkingHandler = async (
  user_id: string,
  client: WebClient,
  trigger_id: string,
  respond: RespondFn,
) => {
  CheckAuth(user_id, respond);

  try {
    await client.views.open({
      trigger_id: trigger_id,
      view: buildReservationModal(initialDate),
    });
  } catch (error) {
    console.error(error);
  }
};
