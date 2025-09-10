"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slack_1 = require("./config/slack");
const slack_2 = require("./slack");
const routes_1 = __importDefault(require("./routes"));
const env_1 = require("./utils/env");
slack_1.receiver.app.use('/api', routes_1.default);
(0, slack_2.CommandManager)();
slack_1.receiver.app.get('/api/hello', async (req, res) => {
    res.send("Hello from Express on Vercel!");
});
(async () => {
    await slack_1.app.start(env_1.ENV.PORT);
    console.log('⚡ FDTParkingBot bot running with ExpressReceiver!');
})();
