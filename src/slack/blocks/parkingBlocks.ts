import { Parking } from './../models/parking';
import { formatDatePL } from '../../utils/formatDate';

export const parkingList = ['FDT Parking 7', 'FDT Parking 8', 'FDT Parking 9', 'FDT Parking Mol'];

export function createParkingBlocks(parking: Parking[]) {
  const tableRows = [
    [
      'Parking',
      'Time',
      'Status'
    ].map((text) => ({
      type: 'rich_text',
      elements: [
        {
          type: 'rich_text_section',
          elements: [{ type: 'text', text, style: { bold: true } }]
        }
      ]
    })),

    ...parkingList.map((parkingName) => {
      const p = parking.find((ev) => ev.summary === parkingName);

      const start = p ? formatDatePL(p.start?.dateTime ?? p.start?.date) : '-';
      const end = p ? formatDatePL(p.end?.dateTime ?? p.end?.date) : '-';
      const status = p ? (p.isFree ? '✅ Available' : '❌ Occupied') : '✅ Available';

      return [
        {
          type: 'rich_text',
          elements: [{ type: 'rich_text_section', elements: [{ type: 'text', text: parkingName }] }]
        },
        {
          type: 'rich_text',
          elements: [{ type: 'rich_text_section', elements: [{ type: 'text', text: `${start}${p ? ' - ' + end : ''}` }] }]
        },
        {
          type: 'rich_text',
          elements: [{ type: 'rich_text_section', elements: [{ type: 'text', text: status }] }]
        }
      ];
    })
  ];

  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'List of available and occupied parking spaces',
        emoji: true
      }
    },
    {
      type: 'table',
      rows: tableRows
    }
  ];
}
