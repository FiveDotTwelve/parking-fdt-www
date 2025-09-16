"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAuth = void 0;
const tokenStorage_1 = require("../../utils/tokenStorage");
const google_1 = require("../../config/google");
const CheckAuth = async (user_id, respond) => {
    if (!(0, tokenStorage_1.getToken)(user_id)) {
        await respond({
            response_type: 'ephemeral',
            text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
        });
        return;
    }
    return (0, google_1.setCredentialsForUser)(user_id);
};
exports.CheckAuth = CheckAuth;
