import { ModalView } from '@slack/types';
import { Parking } from '../models/slackEvent';

export const buildCancelModal = (parking: Parking[]): ModalView => ({
  type: 'modal',
  callback_id: 'submit_parking_reservation_cancellation',
  title: {
    type: 'plain_text',
    text: 'FDTParking',
    emoji: true,
  },
  submit: {
    type: 'plain_text',
    text: 'Confirm Cancellation',
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: 'Cancel',
    emoji: true,
  },
  blocks: [
    {
      type: 'input',
      element: {
        type: 'static_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select a parking spot',
          emoji: true,
        },
        options: parking.map((a) => ({
          text: {
            type: 'plain_text',
            text: `${a.summary} - ${a.start}`,
            emoji: true,
          },
          value: `${a.id}_${a.summary}_${a.start}`,
        })),
        action_id: 'select_parkings_spots_date',
      },
      block_id: 'parking_spot_date_block',
      label: {
        type: 'plain_text',
        text: 'Select a parkings slots',
        emoji: true,
      },
      optional: false,
    },
  ],
});
