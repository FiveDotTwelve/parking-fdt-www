"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParkingCommand = ParkingCommand;
const loginParking_1 = require("../handlers/loginParking");
const helpParking_1 = require("../handlers/helpParking");
const reserveParking_1 = require("../handlers/reserveParking");
const cancelParking_1 = require("../handlers/cancelParking");
const showParking_1 = require("../handlers/showParking");
function ParkingCommand(app) {
    app.command('/parking', async ({ command, ack, respond, client }) => {
        await ack();
        const [action = '', target = ''] = command.text?.trim().split(' ') || [];
        switch (action) {
            case 'login':
                await (0, loginParking_1.LoginParking)(command.user_id, command.user_name, respond);
                break;
            case 'help':
                await (0, helpParking_1.HelpParking)(respond);
                break;
            case 'reserve':
                await (0, reserveParking_1.ReserveParking)(command.user_id, client, command.trigger_id, respond);
                break;
            case 'cancel':
                await (0, cancelParking_1.CancelParking)(command.user_id, client, command.trigger_id, respond);
                break;
            case 'show':
                await (0, showParking_1.ShowParking)(target, command, command.user_id, respond);
                break;
            case 'my':
                await (0, showParking_1.ShowParking)(target, command, command.user_id, respond);
                break;
            default:
                await respond({
                    response_type: 'ephemeral',
                    text: 'Unknown command. Try `/parking help`.',
                });
                break;
        }
    });
}
