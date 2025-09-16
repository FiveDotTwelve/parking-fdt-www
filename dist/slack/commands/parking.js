"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parking = Parking;
const loginParking_1 = require("./handlers/loginParking");
const listParking_1 = require("./handlers/listParking");
const reserveParking_1 = require("./handlers/reserveParking");
const showParking_1 = require("./handlers/showParking");
function Parking(app) {
    app.command('/parking', async ({ command, ack, respond, client }) => {
        await ack();
        const [action = '', target = ''] = command.text?.trim().split(' ') || [];
        switch (action) {
            case 'login':
                await (0, loginParking_1.LoginParkingHandler)(command.user_id, command.user_name, respond);
                break;
            case 'list':
                await (0, listParking_1.ListParkingHandler)(respond);
                break;
            case 'reserve':
                await (0, reserveParking_1.ReserveParkingHandler)(command.user_id, client, command.trigger_id, respond);
                break;
            case 'show':
                await (0, showParking_1.ShowParkingHandler)(target, command.user_id, respond);
                break;
            default:
                await respond({
                    response_type: 'ephemeral',
                    text: 'Unknown command. Try `/parking list`.',
                });
                break;
        }
    });
}
