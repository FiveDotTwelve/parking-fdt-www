import { App } from '@slack/bolt';
import { calendar } from '../../../configs/google';
import { ENV } from '../../../utils/env';

export const ActionCancel = (app: App) => {
  app.view('submit_parking_reservation_cancellation', async ({ body, ack }) => {
    const formValues = body.view.state.values;
    const userId = body.user.id;

    const getValue = (actionId: string) =>
      Object.values(formValues)
        .flatMap((block) => [
          block[actionId]?.selected_option?.value,
          block[actionId]?.selected_date,
        ])
        .find(Boolean);

    const selectedSpotID = getValue('select_parkings_spots_date') as string;

    const [id, summary, date] = selectedSpotID.split('_');

    try {
      await ack();

      await calendar.events.delete({
        calendarId: ENV.GOOGLE_CALENDAR_ID,
        eventId: id,
      });

      await app.client.chat.postMessage({
        channel: userId,
        text: `✅ - You have canceled your reservation for parking spot *${summary}* on *${date}*. `,
      });
    } catch {
      await app.client.chat.postMessage({
        channel: userId,
        text: `❌ - Failed to cancel your reservation for parking spot *${summary}* on *${date}*. Please try again.`,
      });
    }
  });
};
