"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = Login;
const google_1 = require("../../config/google");
const slack_1 = require("../../config/slack");
const kv_1 = require("../../utils/kv");
function Login() {
    slack_1.app.command('/login', async ({ command, ack, respond }) => {
        await ack();
        if (await (0, kv_1.checkCredentials)(command.user_id)) {
            await respond({
                response_type: 'ephemeral',
                text: `Hi ${command.user_name} 👋\nTo book a parking spot, please authorize your Google account first.\n👉 <${(0, google_1.getAuthUrl)(command.user_id)}|Click here to sign in with Google>`,
            });
        }
        else {
            await respond({
                response_type: 'ephemeral',
                text: `Hi ${command.user_name} ✅\nYour Google Calendar is already connected! You can now book parking spots directly.`,
            });
        }
    });
}
