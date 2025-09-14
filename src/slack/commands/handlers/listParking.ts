import { RespondFn } from '@slack/bolt';

export const ListParkingHandler = async (respond: RespondFn) => {
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
};
