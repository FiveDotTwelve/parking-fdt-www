import { ActionReserve } from './actions/actionReserve';
import { ParkingCommand } from './commands/parking';
import { app } from '../configs/slack';
import { ActionCancel } from './actions/actionCancel';

export function SlackApp() {
  ParkingCommand(app);
  ActionReserve(app);
  ActionCancel(app);
}
