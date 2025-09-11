import { ActionReserve } from './commands/actions/actionReserve';
import { List } from './commands/list';
import { Login } from './commands/login';
import { Reserve } from './commands/reserve';

const commands = [List, Login, Reserve, ActionReserve];

export function CommandManager() {
  commands.forEach((cmd) => cmd());
}
