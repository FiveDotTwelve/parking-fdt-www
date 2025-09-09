import { Parking } from './../models/parking';
import { createParkingRow, findParkingEvent } from '../../utils/slack/parkingHelpers';

export const parkingList = ['FDT Parking 7', 'FDT Parking 8', 'FDT Parking 9', 'FDT Parking Mol'];

export function createParkingBlocks(parking: Parking[]) {
  const headerRow = ['Parking', 'Time', 'Status'].map((text) => ({
    type: 'rich_text',
    elements: [
      {
        type: 'rich_text_section',
        elements: [{ type: 'text', text, style: { bold: true } }],
      },
    ],
  }));

  const tableRows = [
    headerRow,
    ...parkingList.map((name) => createParkingRow(name, findParkingEvent(name, parking))),
  ];

  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: 'List of available and occupied parking spaces', emoji: true },
    },
    { type: 'section', text: { type: 'mrkdwn', text: 'Parking space availability this week' } },
    { type: 'table', rows: tableRows },
  ];
}
