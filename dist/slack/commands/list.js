"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = List;
const slack_1 = require("../../config/slack");
async function List() {
    slack_1.app.command('/list', async ({ ack, respond }) => {
        await ack();
        await respond({
            response_type: 'ephemeral',
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: 'List of Available Commands',
                        emoji: true,
                    },
                },
                { type: 'divider' },
                {
                    type: 'rich_text',
                    elements: [
                        {
                            type: 'rich_text_list',
                            style: 'bullet',
                            indent: 0,
                            elements: [
                                {
                                    type: 'rich_text_section',
                                    elements: [
                                        { type: 'text', text: '/list ' },
                                        {
                                            type: 'text',
                                            text: '- Show all commands.',
                                            style: { bold: true },
                                        },
                                    ],
                                },
                                {
                                    type: 'rich_text_section',
                                    elements: [
                                        { type: 'text', text: '/login ' },
                                        {
                                            type: 'text',
                                            text: "- Connect your Slack to Google to book parking.",
                                            style: { bold: true },
                                        },
                                    ],
                                },
                                {
                                    type: 'rich_text_section',
                                    elements: [
                                        { type: 'text', text: '/show ' },
                                        {
                                            type: 'text',
                                            text: "- See which parking spots are free or taken.",
                                            style: { bold: true },
                                        },
                                    ],
                                },
                                {
                                    type: 'rich_text_section',
                                    elements: [
                                        { type: 'text', text: '/reserve ' },
                                        {
                                            type: 'text',
                                            text: "- Reserve a parking spot and add it to your Google Calendar.",
                                            style: { bold: true },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });
}
