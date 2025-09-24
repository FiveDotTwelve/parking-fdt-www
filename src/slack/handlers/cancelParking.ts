import { calendar, setCredentialsForUser } from '../../configs/google';
import { GoogleEvent } from '../../models/googleEvent';
import { ENV } from '../../utils/env';
import { getToken } from '../../utils/tokenStorage';
import convertCalendarEvent from '../lib/convertEvent';
import { GetWeek } from '../../utils/dateUtils';
import { buildCancelModal } from '../modals/cancelModal';
import { WebClient } from '@slack/web-api';
import { RespondFn } from '@slack/bolt';

export const CancelParking = async (
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

    const nextWeekDate = new Date();
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const { end } = GetWeek(nextWeekDate);

    const { data } = await calendar.events.list({
      calendarId: ENV.GOOGLE_CALENDAR_ID,
      singleEvents: true,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      orderBy: 'startTime',
    });

    const parking = ((data.items as GoogleEvent[]) || [])
      .map(convertCalendarEvent)
      .filter((a) =>
        ['FDT Parking 7', 'FDT Parking 8', 'FDT Parking 9', 'FDT Parking MOL'].includes(
          a.summary || '',
        ),
      );

    if (parking.length === 0) {
      await respond({
        response_type: 'ephemeral',
        text: 'You have no upcoming parking reservations to cancel.',
      });
      return;
    }

    try {
      await client.views.open({
        trigger_id: trigger_id,
        view: buildCancelModal(parking),
      });
    } catch (error) {
      console.error(error);
    }
  }
};
