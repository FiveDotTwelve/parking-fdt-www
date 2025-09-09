import { Parking } from "../../slack/models/parking";
import { formatDatePL } from "../formatDate";

function isEventToday(eventDate?: string | null): boolean {
  if (!eventDate) return false;

  const date = new Date(eventDate);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function findParkingEvent(parkingName: string, parking: Parking[]): Parking | undefined {
  return parking.find(
    (ev) =>
      ev.summary === parkingName &&
      (isEventToday(ev.start?.dateTime) || isEventToday(ev.start?.date))
  );
}

function createParkingRow(parkingName: string, event?: Parking) {
  const start = event ? formatDatePL(event.start?.dateTime ?? event.start?.date) : '-';
  const status = event ? (event.isFree ? '✅' : '❌') : '✅';

  return [
    {
      type: 'rich_text',
      elements: [{ type: 'rich_text_section', elements: [{ type: 'text', text: parkingName }] }],
    },
    {
      type: 'rich_text',
      elements: [{ type: 'rich_text_section', elements: [{ text: start, type: 'text' }]}],
    },
    {
      type: 'rich_text',
      elements: [{ type: 'rich_text_section', elements: [{ text: status, type: 'text' }]}],
    },
  ];
}



export {findParkingEvent, isEventToday, createParkingRow}