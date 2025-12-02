import { PlainTextOption } from '@slack/types';

export const PARKING_OPTIONS: PlainTextOption[] = [
  'FDT Parking 7',
  'FDT Parking 8',
  'FDT Parking 9',
].map((spot) => ({
  text: { type: 'plain_text', text: spot, emoji: true },
  value: spot,
}));
