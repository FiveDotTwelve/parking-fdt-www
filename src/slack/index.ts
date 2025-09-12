import { ActionReserve } from './commands/actions/actionReserve';
import { Parking } from './commands/parking';

const commands = [ActionReserve, Parking];

export function CommandManager() {
  commands.forEach((cmd) => cmd());
}
