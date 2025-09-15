import { RespondFn } from '@slack/bolt';
import { calendar } from '../../../../config/google';
import { PARKING_SLOTS } from '../../../constants/parkingSlots';
import convertCalendarEvent from '../../../utils/convertEvent';
import { GoogleEvent } from '../../../../models/googleEvent';
import { initialDate } from '../../../../utils/getDate';
import { ENV } from '../../../../utils/env';
import { CheckAuth } from '../../../utils/checkAuth';

export const showToday = async (user_id: string, respond: RespondFn) => {
  CheckAuth(user_id, respond);

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const { data } = await calendar.events.list({
    calendarId: ENV.GOOGLE_CALENDAR_ID,
    singleEvents: true,
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    orderBy: 'startTime',
  });

  const takenSlots = new Set(
    ((data.items as GoogleEvent[]) || []).map(convertCalendarEvent).map((e) => e.summary),
  );

  const parkingColumn = '*Parking:*\n' + PARKING_SLOTS.join('\n');
  const statusColumn =
    '*Status:*\n' +
    PARKING_SLOTS.map((slot) => (takenSlots.has(slot) ? '[❌]' : '[✅]')).join('\n');

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
                  { type: 'text', text: 'List of available and taken parking slot on ' },
                  { type: 'text', text: initialDate, style: { bold: true } },
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
