import { ModalView, PlainTextOption } from '@slack/types';
import { calendar, getAuthUrl, setCredentialsForUser } from '../../config/google';
import { app } from '../../config/slack';
import { getToken } from '../../utils/tokenStorage';
import { initialDate } from '../../utils/getDate';
import { ENV } from '../../utils/env';
import convertCalendarEvent from '../utils/convertEvent';
import { GoogleEvent } from '../../models/googleEvent';

export function Parking() {
  const PARKING_OPTIONS: PlainTextOption[] = [
    'FDT Parking 7',
    'FDT Parking 8',
    'FDT Parking 9',
    'FDT Parking MOL',
  ].map((spot) => ({
    text: { type: 'plain_text', text: spot, emoji: true },
    value: spot,
  }));

  const buildReservationModal = (initialDate: string): ModalView => ({
    callback_id: 'submit_parking_reservation',
    type: 'modal',
    title: { type: 'plain_text', text: 'FDTParkingBot', emoji: true },
    submit: { type: 'plain_text', text: 'Submit', emoji: true },
    close: { type: 'plain_text', text: 'Cancel', emoji: true },
    blocks: [
      {
        type: 'input',
        block_id: 'parking_spot_block',
        element: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Select a parking spot',
            emoji: true,
          },
          options: PARKING_OPTIONS,
          action_id: 'select_parking_spot',
        },
        label: { type: 'plain_text', text: 'Parking', emoji: true },
      },
      {
        type: 'input',
        block_id: 'parking_date_block',
        element: {
          type: 'datepicker',
          initial_date: initialDate,
          placeholder: {
            type: 'plain_text',
            text: 'Select a date',
            emoji: true,
          },
          action_id: 'parking_date',
        },
        label: { type: 'plain_text', text: 'Reservation Date', emoji: true },
      },
    ],
  });

  app.command('/parking', async ({ command, ack, respond, client }) => {
    await ack();

    const refreshToken = getToken(command.user_id);
    const text = command.text ? command.text.trim().split(' ') : [];

    const main = text[0] || '';
    const sub = text[1] || '';

    switch (main) {
      case 'login':
        if (!refreshToken) {
          await respond({
            response_type: 'ephemeral',
            text: `Hi ${command.user_name} 👋\nTo book a parking spot, please authorize your Google account first.\n👉 <${getAuthUrl(command.user_id)}|Click here to sign in with Google>`,
          });
        } else {
          await respond({
            response_type: 'ephemeral',
            text: `Hi ${command.user_name} ✅\nYour Google Calendar is already connected! You can now book parking spots directly.`,
          });
        }
        break;
      case 'list':
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
                    text: 'List of Available Commands',
                    emoji: true,
                  },
                },
                {
                  type: 'divider',
                },
                {
                  type: 'rich_text',
                  elements: [
                    {
                      type: 'rich_text_list',
                      style: 'bullet',
                      indent: 0,
                      elements: [
                        {
                          type: 'rich_text_section',
                          elements: [
                            {
                              type: 'text',
                              text: '/parking list ',
                            },
                            {
                              type: 'text',
                              text: '- Show all commands',
                              style: {
                                bold: true,
                              },
                            },
                          ],
                        },
                        {
                          type: 'rich_text_section',
                          elements: [
                            {
                              type: 'text',
                              text: '/parking login ',
                            },
                            {
                              type: 'text',
                              text: '- Connect your Slack to Google to book parking.',
                              style: {
                                bold: true,
                              },
                            },
                          ],
                        },
                        {
                          type: 'rich_text_section',
                          elements: [
                            {
                              type: 'text',
                              text: '/parking reserve ',
                            },
                            {
                              type: 'text',
                              text: '- Reserve a parking spot and add it to your Google Calendar.',
                              style: {
                                bold: true,
                              },
                            },
                          ],
                        },
                        {
                          type: 'rich_text_section',
                          elements: [
                            {
                              type: 'text',
                              text: '/parking show [ today | week | next week ] ',
                            },
                            {
                              type: 'text',
                              text: '- Shows available and taken parking spots based on the parameter.',
                              style: {
                                bold: true,
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
        break;
      case 'reserve':
        if (!getToken(command.user_id)) {
          await respond({
            response_type: 'ephemeral',
            text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
          });
          return;
        }

        setCredentialsForUser(command.user_id);

        try {
          await client.views.open({
            trigger_id: command.trigger_id,
            view: buildReservationModal(initialDate),
          });
        } catch (error) {
          console.error(error);
        }
        break;
      case 'show':
        switch (sub) {
          case 'today':
            {
              if (!getToken(command.user_id)) {
                await respond({
                  response_type: 'ephemeral',
                  text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
                });
                return;
              }

              setCredentialsForUser(command.user_id);

              const start = new Date();
              start.setHours(0, 0, 0, 0);
              const end = new Date();
              end.setHours(23, 59, 59, 999);

              const res = await calendar.events.list({
                calendarId: ENV.GOOGLE_CALENDAR_ID,
                singleEvents: true,
                timeMin: start.toISOString(),
                timeMax: end.toISOString(),
                orderBy: 'startTime',
              });

              const parking = res.data.items || [];

              const convertedParkingToday = (parking as GoogleEvent[]).map(convertCalendarEvent);

              console.log(convertedParkingToday);

              respond({
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
                              {
                                type: 'text',
                                text: initialDate,
                                style: {
                                  bold: true,
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              });
            }

            break;
          case 'week':
            console.log('week');
            break;
          case 'week next':
            break;
        }
        break;
      default:
        await respond({
          response_type: 'ephemeral',
          text: 'Unknown command. Try `/parking list`.',
        });
        break;
    }
  });
}
