"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginParking = void 0;
const tokenStorage_1 = require("../../utils/tokenStorage");
const google_1 = require("../../configs/google");
const LoginParking = async (user_id, user_name, respond) => {
    const refreshToken = await (0, tokenStorage_1.getToken)(user_id);
    if (!refreshToken) {
        await respond({
            response_type: 'ephemeral',
            text: `Hi ${user_name} 👋\nBooking, checking, and canceling a parking spot requires Google account authorization. Please sign in with your Google account first.\n👉 <${(0, google_1.getAuthUrl)(user_id)}|Click here to sign in with Google>`,
        });
    }
    else {
        await respond({
            response_type: 'ephemeral',
            text: `Hi ${user_name} ✅\nYour Google Calendar is already connected! You can now book, check, and cancel parking spots directly.`,
        });
    }
};
exports.LoginParking = LoginParking;
