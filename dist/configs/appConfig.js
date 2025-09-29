"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const env_1 = require("../utils/env");
dotenv_1.default.config();
const config = {
    port: Number(env_1.ENV.PORT),
    nodeEnv: env_1.ENV.NODE_ENV,
};
exports.default = config;
