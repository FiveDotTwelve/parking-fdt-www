"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveParkingHandler = void 0;
const getDate_1 = require("../../../utils/getDate");
const reservationModal_1 = require("../../modals/reservationModal");
const tokenStorage_1 = require("../../../utils/tokenStorage");
const google_1 = require("../../../config/google");
const ReserveParkingHandler = async (user_id, client, trigger_id, respond) => {
    if (!(0, tokenStorage_1.getToken)(user_id)) {
        await respond({
            response_type: 'ephemeral',
            text: 'You must be logged in via Google Auth. Use the `/parking login` command.',
        });
        return;
    }
    else {
        (0, google_1.setCredentialsForUser)(user_id);
        try {
            await client.views.open({
                trigger_id: trigger_id,
                view: (0, reservationModal_1.buildReservationModal)(getDate_1.initialDate),
            });
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.ReserveParkingHandler = ReserveParkingHandler;
