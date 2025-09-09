import { calendar } from '../../config/google';
import { app } from '../../config/slack';
import { ENV } from '../../utils/env';
import { getCurrentWeekRange } from '../../utils/nowDate';
import { tokenManager } from '../../utils/tokenManager';
import { createParkingBlocks } from '../blocks/parkingBlocks';
import { Parking } from '../models/parking';

export function Show() {
  app.command('/show', async ({ command, ack, respond }) => {
    await ack();

    tokenManager.setCredentialsForUser(command.user_id);

    try {
      const { startOfWeek, endOfWeek } = getCurrentWeekRange();

      const response = await calendar.events.list({
        calendarId: ENV.GOOGLE_CALENDAR_ID,
        singleEvents: true,
        timeMin: startOfWeek.toISOString(),
        timeMax: endOfWeek.toISOString(),
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      const parking: Parking[] = events.map((ev) => {
        return {
          summary: ev.summary || 'No Title',
          start: {
            dateTime: ev.start?.dateTime ?? undefined,
            date: ev.start?.date ?? undefined,
            timeZone: 'Europe/Warsaw',
          },
          end: {
            dateTime: ev.end?.dateTime ?? undefined,
            date: ev.end?.date ?? undefined,
            timeZone: 'Europe/Warsaw',
          },
          isFree: ev.transparency === 'transparent',
        };
      });

      const blocks = createParkingBlocks(parking);

      await respond({
        response_type: 'in_channel',
        blocks,
      });
    } catch (error) {
      console.error(error);
    }
  });
}
