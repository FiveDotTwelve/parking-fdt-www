"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowParkingHandler = void 0;
const showToday_1 = require("./show/showToday");
const showWeek_1 = require("./show/showWeek");
const showNext_1 = require("./show/showNext");
const ShowParkingHandler = async (target, user_id, respond) => {
    if (!target) {
        await respond({
            response_type: 'ephemeral',
            attachments: [
                {
                    color: '#E42930',
                    blocks: [
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: 'Try `/parking show [query]` - parameter is required, here is the list of parameters\n',
                            },
                        },
                        {
                            type: 'rich_text',
                            elements: [
                                {
                                    type: 'rich_text_list',
                                    style: 'bullet',
                                    indent: 0,
                                    border: 0,
                                    elements: [
                                        {
                                            type: 'rich_text_section',
                                            elements: [
                                                {
                                                    type: 'text',
                                                    text: 'today',
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: 'text',
                                                    text: ' – shows taken and available parking slots for today',
                                                },
                                            ],
                                        },
                                        {
                                            type: 'rich_text_section',
                                            elements: [
                                                {
                                                    type: 'text',
                                                    text: 'week',
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: 'text',
                                                    text: ' – shows taken and available parking slots for this week',
                                                },
                                            ],
                                        },
                                        {
                                            type: 'rich_text_section',
                                            elements: [
                                                {
                                                    type: 'text',
                                                    text: 'next',
                                                    style: {
                                                        bold: true,
                                                    },
                                                },
                                                {
                                                    type: 'text',
                                                    text: ' – shows taken and available parking slots for next week',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        return;
    }
    else {
        switch (target) {
            case 'today':
                await (0, showToday_1.showToday)(user_id, respond);
                break;
            case 'week':
                await (0, showWeek_1.showWeek)(user_id, respond);
                break;
            case 'next':
                await (0, showNext_1.showNext)(user_id, respond);
                break;
            default:
                await respond({
                    response_type: 'ephemeral',
                    text: 'Unknown parameter. Use `today`, `week` or `next`.',
                });
                break;
        }
    }
};
exports.ShowParkingHandler = ShowParkingHandler;
