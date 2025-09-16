import { RespondFn } from '@slack/bolt';
import { calendar, setCredentialsForUser } from '../../../../config/google';
import { PARKING_SLOTS } from '../../../constants/parkingSlots';
import convertCalendarEvent from '../../../lib/convertEvent';
import { GoogleEvent } from '../../../../models/googleEvent';
import { ENV } from '../../../../utils/env';
import { generateDates } from '../../../lib/generateDates';
import { GetWeek } from '../../../lib/getWeek';
import { getToken } from '../../../../utils/tokenStorage';

export const showNext = async (user_id: string, respond: RespondFn) => {
  if (!getToken(user_id)) {
    await respond({
      response_type: 'ephemeral',
      text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
    });
    return;
  } else {
    setCredentialsForUser(user_id);

    const nextWeekDate = new Date();
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);

    const { start, end } = GetWeek(nextWeekDate);

    const { data } = await calendar.events.list({
      calendarId: ENV.GOOGLE_CALENDAR_ID,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const dates = generateDates(start, end);

    const takenDays = (slot: string): string[] => {
      return ((data.items as GoogleEvent[]) || [])
        .map(convertCalendarEvent)
        .filter((a) => a.summary === slot)
        .map((a) => a.start!)
        .filter(Boolean);
    };

    const statusLines = (parkings_days: string[]): string => {
      return dates
        .map((date) => {
          return parkings_days.includes(date) ? '[❌]' : '[✅]';
        })
        .join(' ');
    };

    const statusColumn =
      '*Status:*\n' +
      PARKING_SLOTS.map((slot) => {
        const parkings_days = takenDays(slot);

        return statusLines(parkings_days);
      }).join('\n');

    const parkingColumn = '*Parking:*\n' + PARKING_SLOTS.join('\n');

    await respond({
      response_type: 'in_channel',
      attachments: [
        {
          color: '#E42930',
          blocks: [
            {
              type: 'rich_text',
              elements: [
                {
                  type: 'rich_text_section',
                  elements: [
                    { type: 'text', text: `List of available and taken parking slot this ` },
                    {
                      type: 'text',
                      text: `${start.toLocaleDateString('pl-PL')} - ${end.toLocaleDateString('pl-PL')}`,
                      style: { bold: true },
                    },
                  ],
                },
              ],
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: parkingColumn },
                { type: 'mrkdwn', text: statusColumn },
              ],
            },
            { type: 'divider' },
          ],
        },
      ],
    });
  }
};
