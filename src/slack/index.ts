import { ActionReserve } from './commands/actions/actionReserve';
import { ParkingCommand } from './commands/parking';
import { app } from '../config/slack';
import { ActionCancel } from './commands/actions/actionCancel';

export function CommandManager() {
  ParkingCommand(app);
  ActionReserve(app);
  ActionCancel(app);
}
