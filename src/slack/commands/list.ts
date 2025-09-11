import { app } from '../../config/slack';

export async function List() {
  app.command('/list', async ({ ack, respond }) => {
    await ack();

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
                          text: '/list ',
                        },
                        {
                          type: 'text',
                          text: '- Show all commands.',
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
                          text: '/login ',
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
                          text: '/reserve ',
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
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });
}
