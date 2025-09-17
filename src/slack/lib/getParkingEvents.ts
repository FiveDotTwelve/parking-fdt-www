import { calendar } from '../../config/google';
import { setCredentialsForUser } from '../../config/google';
import { GoogleEvent } from '../../models/googleEvent';
import { ENV } from '../../utils/env';

export async function GetParkingEvents(
  parkingSpot: string,
  userId: string,
): Promise<GoogleEvent[]> {
  setCredentialsForUser(userId);

  const { data } = await calendar.events.list({
    calendarId: ENV.GOOGLE_CALENDAR_ID,
    q: parkingSpot,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return data.items as GoogleEvent[];
}
