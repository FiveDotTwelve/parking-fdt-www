"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildReservationModal = void 0;
const parkingOptions_1 = require("../constants/parkingOptions");
const buildReservationModal = (initialDate) => ({
    callback_id: 'submit_parking_reservation',
    type: 'modal',
    title: { type: 'plain_text', text: 'FDTParking', emoji: true },
    submit: { type: 'plain_text', text: 'Submit', emoji: true },
    close: { type: 'plain_text', text: 'Cancel', emoji: true },
    blocks: [
        {
            type: 'input',
            block_id: 'parking_spot_block',
            element: {
                type: 'static_select',
                placeholder: { type: 'plain_text', text: 'Select a parking spot', emoji: true },
                options: parkingOptions_1.PARKING_OPTIONS,
                action_id: 'select_parking_spot',
            },
            label: { type: 'plain_text', text: 'Parking', emoji: true },
            optional: false,
        },
        {
            type: 'input',
            block_id: 'parking_date_block',
            element: {
                type: 'datepicker',
                initial_date: initialDate,
                placeholder: { type: 'plain_text', text: 'Select a date', emoji: true },
                action_id: 'parking_date',
            },
            label: { type: 'plain_text', text: 'Reservation Date', emoji: true },
            optional: false,
        },
    ],
});
exports.buildReservationModal = buildReservationModal;
