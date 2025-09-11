import { GoogleEvent } from "../../models/google-event";
import { Parking } from "../models/slack-event";

export default function convertCalendarEvent(ev: GoogleEvent) : Parking {
    return {
    summary: ev.summary ?? undefined,
    start: ev.start?.date || ev.start?.dateTime || undefined,
    end: ev.end?.date || ev.end?.dateTime || undefined,
    status: ev.transparency === 'transparent',
    }
}