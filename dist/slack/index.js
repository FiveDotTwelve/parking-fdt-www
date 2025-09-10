"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = CommandManager;
const list_1 = require("./commands/list");
const login_1 = require("./commands/login");
const commands = [list_1.List, login_1.Login];
function CommandManager() {
    commands.forEach(cmd => cmd());
}
