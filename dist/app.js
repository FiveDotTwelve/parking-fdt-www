"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const slack_1 = require("./config/slack");
const slack_2 = require("./slack");
const routes_1 = __importDefault(require("./routes"));
const env_1 = require("./utils/env");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const serverless_http_1 = __importDefault(require("serverless-http"));
slack_1.receiver.app.use('/api', routes_1.default);
(0, slack_2.CommandManager)();
slack_1.receiver.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
slack_1.receiver.app.set('views', path_1.default.join(__dirname, 'views'));
slack_1.receiver.app.set('view engine', 'ejs');
slack_1.receiver.app.get('/', (req, res) => {
    res.json({ ok: true, message: 'API działa!' });
});
if (env_1.ENV.NODE_ENV !== 'production') {
    (async () => {
        await slack_1.app.start(env_1.ENV.PORT);
        console.log('⚡ FDTParkingBot running locally!');
        console.log(`Server running at http://localhost:${env_1.ENV.PORT}`);
    })();
}
exports.handler = (0, serverless_http_1.default)(slack_1.receiver.app);
