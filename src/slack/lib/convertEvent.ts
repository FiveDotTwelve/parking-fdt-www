import { GoogleEvent } from '../../models/googleEvent';
import { Parking } from '../models/slackEvent';

export default function convertCalendarEvent(ev: GoogleEvent): Parking {
  const startDate = ev.start?.date || ev.start?.dateTime?.slice(0, 10);

  return {
    id: ev.id ?? '',
    summary: ev.summary ?? undefined,
    start: startDate,
    end: startDate,
    status: ev.transparency === 'transparent',
  };
}
