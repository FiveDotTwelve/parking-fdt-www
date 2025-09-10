import { List } from './commands/list';
import { Login } from './commands/login';


const commands = [List, Login];

export function CommandManager() {
  commands.forEach(cmd => cmd());
}