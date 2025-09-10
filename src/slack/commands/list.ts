import { app } from '../../config/slack';

export async function List() {
  app.command('/list', async ({ ack, respond }) => {
    await ack();

    await respond({
      response_type: 'ephemeral',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Here is the list of commands',
            emoji: true,
          },
        },
        { type: 'divider' },
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
                    { type: 'text', text: '/list ' },
                    {
                      type: 'text',
                      text: '- display all commands.',
                      style: { bold: true },
                    },
                  ],
                },
                {
                  type: 'rich_text_section',
                  elements: [
                    { type: 'text', text: '/login ' },
                    {
                      type: 'text',
                      text: '- Connects Slack with Google to book parking spots.',
                      style: { bold: true },
                    },
                  ],
                },
                {
                  type: 'rich_text_section',
                  elements: [
                    { type: 'text', text: '/show ' },
                    {
                      type: 'text',
                      text: '- Displays available and occupied parking spaces.',
                      style: { bold: true },
                    },
                  ],
                },
                                {
                  type: 'rich_text_section',
                  elements: [
                    { type: 'text', text: '/reserve ' },
                    {
                      type: 'text',
                      text: '- Reserves a parking spot in FDT Parking and adds it to your Google Calendar.',
                      style: { bold: true },
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
