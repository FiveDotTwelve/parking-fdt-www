export const showBlock = () => {
  //   const parkingList = ['FDT Parking 7', 'FDT Parking 8', 'FDT Parking 9', 'FDT Parking Mol'];

  const block = [
    [
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
        type: 'table',
        rows: [
          [
            {
              type: 'rich_text',
              elements: [
                {
                  type: 'rich_text_section',
                  elements: [{ type: 'text', text: 'Parking', style: { bold: true } }],
                },
              ],
            },
          ],
          [
            {
              type: 'rich_text',
              elements: [
                {
                  type: 'rich_text_section',
                  elements: [
                    {
                      type: 'text',
                      text: 'Test',
                    },
                  ],
                },
              ],
            },
            {
              type: 'rich_text',
              elements: [
                {
                  type: 'rich_text_section',
                  elements: [
                    {
                      type: 'text',
                      text: 'Test',
                    },
                  ],
                },
              ],
            },
            {
              type: 'rich_text',
              elements: [
                {
                  type: 'rich_text_section',
                  elements: [
                    {
                      type: 'text',
                      text: 'Test',
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },
    ],
  ];
  return block;
};
