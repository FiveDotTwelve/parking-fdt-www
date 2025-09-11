import { setCredentialsForUser } from '../../config/google';
import { app } from '../../config/slack';
import { initialDate } from '../../utils/getDate';
import { getToken } from '../../utils/tokenStorage';

export function Reserve() {
  app.command('/reserve', async ({ command, ack, respond, client }) => {
    await ack();

    if (!getToken(command.user_id)) {
      await ack();
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
        view: {
          callback_id: "submit_parking_reservation",
          type: 'modal',
          title: {
            type: 'plain_text',
            text: 'FDTParkingBot',
            emoji: true,
          },
          submit: {
            type: 'plain_text',
            text: 'Submit',
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
                options: [
                  {
                    text: { type: 'plain_text', text: 'FDT Parking 7', emoji: true },
                    value: 'FDT Parking 7',
                  },
                  {
                    text: { type: 'plain_text', text: 'FDT Parking 8', emoji: true },
                    value: 'FDT Parking 8',
                  },
                  {
                    text: { type: 'plain_text', text: 'FDT Parking 9', emoji: true },
                    value: 'FDT Parking 9',
                  },
                  {
                    text: { type: 'plain_text', text: 'FDT Parking MOL', emoji: true },
                    value: 'FDT Parking MOL',
                  },
                ],
                action_id: 'select_parking_spot',
              },
              label: {
                type: 'plain_text',
                text: 'Parking',
                emoji: true,
              },
            },
            {
              type: 'input',
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
              label: {
                type: 'plain_text',
                text: 'Reservation Date',
                emoji: true,
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
}
