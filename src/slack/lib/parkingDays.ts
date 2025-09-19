import { RespondFn } from '@slack/bolt';
import { PARKING_SLOTS } from '../constants/parkingSlots';
import { GoogleEvent } from '../../models/googleEvent';
import convertCalendarEvent from './convertEvent';
import { calendar, setCredentialsForUser } from '../../config/google';
import { ENV } from '../../utils/env';
import { getToken } from '../../utils/tokenStorage';
import { initialDate } from '../../utils/getDate';
import { generateWorkweekDates, getNextWeekRange, GetWeek } from '../../utils/dateUtils';
import { Parking } from '../models/slackEvent';

export const ParkingToday = async (user_id: string, respond: RespondFn) => {
  if (!(await getToken(user_id))) {
    await respond({
      response_type: 'ephemeral',
      text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
    });
    return;
  } else {
    await setCredentialsForUser(user_id);

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
                    {
                      type: 'text',
                      text: 'List of available and taken parking slot on ',
                    },
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
  }
};

export const ParkingWeek = async (user_id: string, respond: RespondFn) => {
  if (!(await getToken(user_id))) {
    await respond({
      response_type: 'ephemeral',
      text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
    });
    return;
  } else {
    await setCredentialsForUser(user_id);

    const { start, end } = GetWeek(new Date());

    const { data } = await calendar.events.list({
      calendarId: ENV.GOOGLE_CALENDAR_ID,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const today = new Date().toISOString().split('T')[0];

    const generateDates = (start: Date, end: Date): string[] => {
      const dates: string[] = [];
      const current = new Date(start);

      while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }

      console.log(dates);
      return dates;
    };

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
          if (date < today) return '[❌]';
          return parkings_days.includes(date) ? '[❌]' : '[✅]';
        })
        .join(' ');
    };

    const statusColumn =
      '[PON][WT][ŚR][CZW][PT]\n' +
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
                    {
                      type: 'text',
                      text: `List of available and taken parking slot this `,
                    },
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

export const ParkingNext = async (user_id: string, respond: RespondFn) => {
  if (!(await getToken(user_id))) {
    await respond({
      response_type: 'ephemeral',
      text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
    });
    return;
  } else {
    await setCredentialsForUser(user_id);
    const { nextMonday, nextFriday } = getNextWeekRange();
    const dates = generateWorkweekDates(nextMonday);
    const { data } = await calendar.events.list({
      calendarId: ENV.GOOGLE_CALENDAR_ID,
      singleEvents: true,
      timeMin: nextMonday.toISOString(),
      timeMax: nextFriday.toISOString(),
      timeZone: 'Europe/Warsaw',
      orderBy: 'startTime',
    });

    const events = ((data.items as GoogleEvent[]) || []).map(convertCalendarEvent);

    const takenDays = (slot: string, events: Parking[]) => {
      return events.filter((a) => a.summary === slot).map((a) => a.start!);
    };

    const statusLines = (dates: string[], taken: string[]) =>
      dates.map((d) => (taken.includes(d) ? '[❌]' : '[✅]')).join(' ');

    const parkingColumn = '*Parking:*\n' + PARKING_SLOTS.join('\n');
    const statusColumn =
      '[PON][WT][ŚR][CZW][PT]\n' +
      PARKING_SLOTS.map((slot) => statusLines(dates, takenDays(slot, events))).join('\n');

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
                    {
                      type: 'text',
                      text: `List of available and taken parking slot this `,
                    },
                    {
                      type: 'text',
                      text: `${nextMonday.toLocaleDateString('pl-PL')} - ${nextFriday.toLocaleDateString('pl-PL')}`,
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
