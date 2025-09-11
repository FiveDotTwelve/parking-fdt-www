import { calendar, setCredentialsForUser } from '../../config/google';
import { app } from '../../config/slack';
import { GoogleEvent } from '../../models/google-event';
import { ENV } from '../../utils/env';
import { getToken } from '../../utils/tokenStorage';
import { Parking } from '../models/slack-event';
import convertCalendarEvent from '../utils/convertEvent';

export function Show() {
  app.command('/show', async ({ command, ack, respond }) => {
    if (!getToken(command.user_id)) {
      await ack();
      await respond({
        response_type: 'ephemeral',
        text: 'You must be logged in via Google Auth. Use the /login command.',
      });
      return;
    }

    await ack();

    setCredentialsForUser(command.user_id);

    try {
      const res = await calendar.events.list({
        calendarId: ENV.GOOGLE_CALENDAR_ID,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const googleEvents = res.data.items || [];
      const parkings: Parking[] = (googleEvents as GoogleEvent[]).map(convertCalendarEvent);

      console.log(googleEvents);
      console.log(parkings);

      await respond({
        response_type: 'ephemeral',
        attachments: [
          {
            color: '#E42930',
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: '🅿️ Available and occupied parking spaces ',
                  emoji: true,
                },
              },
              {
                type: 'rich_text',
                elements: [
                  {
                    type: 'rich_text_section',
                    elements: [
                      {
                        type: 'text',
                        text: 'Parking space availability this week',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: '*Parking*',
                  },
                  {
                    type: 'mrkdwn',
                    text: '*Date*',
                  },
                  {
                    type: 'mrkdwn',
                    text: '*Status*',
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  });
}
