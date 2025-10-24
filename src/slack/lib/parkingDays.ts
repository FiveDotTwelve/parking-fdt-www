import { RespondFn } from '@slack/bolt';
import { PARKING_SLOTS } from '../constants/parkingSlots';
import { GoogleEvent } from '../../models/googleEvent';
import convertCalendarEvent from './convertEvent';
import { calendar, getLoggedUser, setCredentialsForUser } from '../../configs/google';
import { ENV } from '../../utils/env';
import { getToken } from '../../utils/tokenStorage';
import { getInitialDate } from '../../utils/getDate';
import {
  generateDates,
  generateWorkweekDates,
  getNextWeekRange,
  GetWeek,
} from '../../utils/dateUtils';
import { Parking } from '../models/slackEvent';

export const ParkingToday = async (user_id: string, respond: RespondFn) => {
  console.log('user_id', user_id);
  if (!(await getToken(user_id))) {
    await respond({
      response_type: 'ephemeral',
      text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
    });
    return;
  } else {
    await setCredentialsForUser(user_id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDate = today.toISOString().split('T')[0];

    const start = new Date(today);
    start.setDate(start.getDate() - 1);
    const end = new Date(today);
    end.setDate(end.getDate() + 1);

    const { data } = await calendar.events.list({
      calendarId: ENV.GOOGLE_CALENDAR_ID,
      singleEvents: true,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      orderBy: 'startTime',
    });

    console.log('calendar.events.list', data);

    const takenSlots = new Set(
      ((data.items as GoogleEvent[]) || [])
        .map(convertCalendarEvent)
        .filter((e) => e.start === todayDate)
        .map((e) => e.summary),
    );

    const parkingColumn = '*Parking:*\n' + PARKING_SLOTS.join('\n');
    const statusColumn =
      '*Status:*\n' +
      PARKING_SLOTS.map((slot) => (takenSlots.has(slot) ? '[❌]' : '[✅]')).join('\n');

    console.log('statusColumn', statusColumn);
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
                    { type: 'text', text: getInitialDate(), style: { bold: true } },
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

    const dates = generateDates(start, end);

    console.log('dates', dates);
    console.log('start, end', start, end);

    const takenDays = (slot: string): string[] => {
      return ((data.items as GoogleEvent[]) || [])
        .map(convertCalendarEvent)
        .filter((a) => a.summary === slot)
        .map((a) => a.start!)
        .filter(Boolean);
    };

    const statusLines = (parkings_days: string[]): string => {
      console.log('parkings_days', parkings_days);
      return dates
        .map((date) => {
          console.log('date: ', date, 'today: ', today, parkings_days.includes(date));
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
    console.log('nextMonday.toISOString()', nextMonday.toISOString());
    console.log('nextFriday.toISOString()', nextFriday.toISOString());
    const dates = generateWorkweekDates(nextMonday);

    // Extend timeMin by one day back to catch all-day events starting on Monday
    const timeMin = new Date(nextMonday);
    timeMin.setDate(timeMin.getDate() - 1);

    // Extend timeMax by one day forward to catch all-day events ending on Friday
    const timeMax = new Date(nextFriday);
    timeMax.setDate(timeMax.getDate() + 1);

    const { data } = await calendar.events.list({
      calendarId: ENV.GOOGLE_CALENDAR_ID,
      singleEvents: true,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
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

export const ParkingMy = async (user_id: string, respond: RespondFn) => {
  if (!(await getToken(user_id))) {
    await respond({
      response_type: 'ephemeral',
      text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
    });
    return;
  } else {
    await setCredentialsForUser(user_id);

    // Extend timeMin by one day back to catch all-day events starting on Monday
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - 1);

    const { data } = await calendar.events.list({
      calendarId: ENV.GOOGLE_CALENDAR_ID,
      singleEvents: true,
      timeMin: timeMin.toISOString(),
      timeZone: 'Europe/Warsaw',
      orderBy: 'startTime',
    });

    const events = ((data.items as GoogleEvent[]) || [])
      .filter((e) => e.creator?.email === loggedUser.email)
      .map(convertCalendarEvent);

    const loggedUser = await getLoggedUser(user_id);

    // Step 5: Prepare a readable list (e.g. "Mon 21.10 – Parking 7")
    const myReservations = events
      .map((e) => {
        const date = new Date(e.start!).toLocaleDateString('pl-PL', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
        });
        return `• ${date} – ${e.summary}`;
      })
      .join('\n');

    const messageText =
      myReservations.length > 0
        ? `*Your future parking reservations:*\n${myReservations}`
        : `You have no parking reservations.`;

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
                      text: `${messageText}`,
                      style: { bold: true },
                    },
                  ],
                },
              ],
            },
            { type: 'divider' },
          ],
        },
      ],
    });
  }
};
