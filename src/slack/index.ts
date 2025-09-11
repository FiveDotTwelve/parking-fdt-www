import { ActionReserve } from './commands/actions/actionReserve';
import { List } from './commands/list';
import { Login } from './commands/login';
import { Reserve } from './commands/reserve';
import { Show } from './commands/show';


const commands = [List, Login, Show, Reserve, ActionReserve];

export function CommandManager() {
  commands.forEach(cmd => cmd());
}