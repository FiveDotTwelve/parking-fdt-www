import { RespondFn } from '@slack/bolt';
import { showToday } from './show/showToday';
import { showWeek } from './show/showWeek';

export const ShowParkingHandler = async (target: string, user_id: string, respond: RespondFn) => {
  if (!target) {
    await respond({
      response_type: 'ephemeral',
      attachments: [
        {
          color: '#E42930',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Try `/parking show [query]` - parameter is required, here is the list of parameters\n',
              },
            },
            {
              type: 'rich_text',
              elements: [
                {
                  type: 'rich_text_list',
                  style: 'bullet',
                  indent: 0,
                  border: 0,
                  elements: [
                    {
                      type: 'rich_text_section',
                      elements: [
                        {
                          type: 'text',
                          text: 'today',
                          style: {
                            bold: true,
                          },
                        },
                        {
                          type: 'text',
                          text: ' – shows taken and available parking slots for today',
                        },
                      ],
                    },
                    {
                      type: 'rich_text_section',
                      elements: [
                        {
                          type: 'text',
                          text: 'week',
                          style: {
                            bold: true,
                          },
                        },
                        {
                          type: 'text',
                          text: ' – shows taken and available parking slots for this week',
                        },
                      ],
                    },
                    {
                      type: 'rich_text_section',
                      elements: [
                        {
                          type: 'text',
                          text: 'next week',
                          style: {
                            bold: true,
                          },
                        },
                        {
                          type: 'text',
                          text: ' – shows taken and available parking slots for next week',
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

    return;
  } else {
    switch (target) {
      case 'today':
        await showToday(user_id, respond);
        break;
      case 'week':
        await showWeek(user_id, respond);
        break;
      case 'week next':
      default:
        await respond({
          response_type: 'ephemeral',
          text: 'Unknown parameter. Use `today`, `week` or `next week`.',
        });
        break;
    }
  }
};
