import { ModalView, PlainTextOption } from '@slack/types';
import { setCredentialsForUser } from '../../config/google';
import { app } from '../../config/slack';
import { initialDate } from '../../utils/getDate';
import { getToken } from '../../utils/tokenStorage';

const PARKING_OPTIONS: PlainTextOption[] = [
  'FDT Parking 7',
  'FDT Parking 8',
  'FDT Parking 9',
  'FDT Parking MOL',
].map((spot) => ({
  text: { type: 'plain_text', text: spot, emoji: true },
  value: spot,
}));

const buildReservationModal = (initialDate: string): ModalView => ({
  callback_id: 'submit_parking_reservation',
  type: 'modal',
  title: { type: 'plain_text', text: 'FDTParkingBot', emoji: true },
  submit: { type: 'plain_text', text: 'Submit', emoji: true },
  close: { type: 'plain_text', text: 'Cancel', emoji: true },
  blocks: [
    {
      type: 'input',
      block_id: 'parking_spot_block',
      element: {
        type: 'static_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select a parking spot',
          emoji: true,
        },
        options: PARKING_OPTIONS,
        action_id: 'select_parking_spot',
      },
      label: { type: 'plain_text', text: 'Parking', emoji: true },
    },
    {
      type: 'input',
      block_id: 'parking_date_block',
      element: {
        type: 'datepicker',
        initial_date: initialDate,
        placeholder: {
          type: 'plain_text',
          text: 'Select a date',
          emoji: true,
        },
        action_id: 'parking_date',
      },
      label: { type: 'plain_text', text: 'Reservation Date', emoji: true },
    },
  ],
});

export function Reserve() {
  app.command('/reserve', async ({ command, ack, respond, client }) => {
    await ack();

    if (!getToken(command.user_id)) {
      await respond({
        response_type: 'ephemeral',
        text: 'You must be logged in via Google Auth. Use the /login command.',
      });
      return;
    }

    setCredentialsForUser(command.user_id);

    try {
      await client.views.open({
        trigger_id: command.trigger_id,
        view: buildReservationModal(initialDate),
      });
    } catch (error) {
      console.error(error);
    }
  });
}
