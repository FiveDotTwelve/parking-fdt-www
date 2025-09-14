import { ActionReserve } from './commands/actions/actionReserve';
import { Parking } from './commands/parking';
import { app } from '../config/slack';

export function CommandManager() {
  Parking(app);
  ActionReserve(app);
}
