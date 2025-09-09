export interface GoogleEvent {
  kind?: string;
  etag?: string;
  id?: string;
  status?: string;
  htmlLink?: string;
  created?: string; 
  updated?: string;
  summary?: string;
  description?: string;
  location?: string;
  creator?: {
    displayName: string,
    email?: string;
  };
  organizer?: {
    email?: string;
    self?: boolean;
  };
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  iCalUID?: string;
  sequence?: number;
  reminders?: {
    useDefault?: boolean;
  };
  eventType?: string;
}

export type GoogleEvents = GoogleEvent[];