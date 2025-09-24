import { App } from '@slack/bolt';
import { calendar } from '../../configs/google';
import { ENV } from '../../utils/env';
import { CheckParkingTaken } from '../lib/checkParkingTaken';

export const ActionReserve = (app: App) => {
  app.view('submit_parking_reservation', async ({ body, ack }) => {
    const formValues = body.view.state.values;
    const userId = body.user.id;
    const today = new Date().toISOString().split('T')[0];

    const getValue = (actionId: string) =>
      Object.values(formValues)
        .flatMap((block) => [
          block[actionId]?.selected_option?.value,
          block[actionId]?.selected_date,
        ])
        .find(Boolean);

    const selectedSpot = getValue('select_parking_spot') as string;
    const selectedDate = getValue('parking_date') as string;

    const isTaken = await CheckParkingTaken(selectedSpot, selectedDate, userId);

    const dateBlockId = Object.keys(formValues).find((blockId) => formValues[blockId].parking_date);

    if (isTaken) {
      await ack({
        response_action: 'errors',
        errors: {
          [dateBlockId || 'parking_date_block']:
            `Parking spot ${selectedSpot} is already booked for ${selectedDate}.`,
        },
      });

      return;
    } else if (selectedDate < today) {
      await ack({
        response_action: 'errors',
        errors: {
          [dateBlockId || 'parking_date_block']: `You can't reserve a parking spot in the past.`,
        },
      });

      return;
    }

    try {
      await ack();

      await calendar.events.insert({
        calendarId: ENV.GOOGLE_CALENDAR_ID,
        requestBody: {
          summary: selectedSpot,
          start: {
            date: selectedDate,
          },
          end: {
            date: selectedDate,
          },
        },
      });

      await app.client.chat.postMessage({
        channel: userId,
        text: `✅ - You have successfully reserved parking spot *${selectedSpot}* for *${selectedDate}*. `,
      });
    } catch {
      await app.client.chat.postMessage({
        channel: userId,
        text: `❌ - Failed to reserved for parking spot *${selectedSpot}* for *${selectedDate}*. Please try again. `,
      });
    }
  });
};
