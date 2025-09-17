import { GoogleEvent } from '../../models/googleEvent';
import convertCalendarEvent from './convertEvent';
import { GetParkingEvents } from './getParkingEvents';

export async function CheckParkingTaken(
  parkingSpot: string,
  date: string,
  userId: string,
): Promise<boolean> {
  const parkings: GoogleEvent[] = await GetParkingEvents(parkingSpot, userId);
  return parkings.some((ev) => convertCalendarEvent(ev).start === date);
}
