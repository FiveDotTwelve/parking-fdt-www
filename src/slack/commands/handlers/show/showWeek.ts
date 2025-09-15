import { RespondFn } from '@slack/bolt';
import { calendar } from '../../../../config/google';
import { PARKING_SLOTS } from '../../../constants/parkingSlots';
import convertCalendarEvent from '../../../utils/convertEvent';
import { GoogleEvent } from '../../../../models/googleEvent';
import { ENV } from '../../../../utils/env';
import { CheckAuth } from '../../../utils/checkAuth';
import { GetWeek } from '../../../utils/getWeek';

export const showWeek = async (user_id: string, respond: RespondFn) => {
  CheckAuth(user_id, respond);

  const { start, end } = GetWeek(new Date());

  const { data } = await calendar.events.list({
    calendarId: ENV.GOOGLE_CALENDAR_ID,
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const dates: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  const statusColumn =
    '*Status:*\n' +
    PARKING_SLOTS.map((slot) => {
      const takenDays = ((data.items as GoogleEvent[]) || [])
        .map(convertCalendarEvent)
        .filter((a) => a.summary === slot)
        .map((a) => a.start);

      const statusLine = dates
        .map((date) => (takenDays.includes(date) ? '[❌]' : '[✅]'))
        .join(' ');
      return `${statusLine}`;
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
};
