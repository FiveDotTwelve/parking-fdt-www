import { GoogleEvent } from '../../models/google-event';
import { Parking } from '../models/slack-event';

export default function convertCalendarEvent(ev: GoogleEvent): Parking {
  const startDate = ev.start?.date || ev.start?.dateTime?.slice(0, 10);

  return {
    summary: ev.summary ?? undefined,
    start: startDate,
    end: startDate,
    status: ev.transparency === 'transparent',
  };
}
