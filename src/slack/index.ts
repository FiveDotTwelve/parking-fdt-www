import { Login } from "./commands/login";
import { Show } from "./commands/show";

export const CommandManager = {
    login: () => Login(),
    show: () => Show(),
};
