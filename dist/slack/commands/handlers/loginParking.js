"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginParkingHandler = void 0;
const tokenStorage_1 = require("../../../utils/tokenStorage");
const google_1 = require("../../../config/google");
const LoginParkingHandler = async (user_id, user_name, respond) => {
    const refreshToken = (0, tokenStorage_1.getToken)(user_id);
    if (!refreshToken) {
        await respond({
            response_type: 'ephemeral',
            text: `Hi ${user_name} 👋\nTo book a parking spot, please authorize your Google account first.\n👉 <${(0, google_1.getAuthUrl)(user_id)}|Click here to sign in with Google>`,
        });
    }
    else {
        await respond({
            response_type: 'ephemeral',
            text: `Hi ${user_name} ✅\nYour Google Calendar is already connected! You can now book parking spots directly.`,
        });
    }
};
exports.LoginParkingHandler = LoginParkingHandler;
