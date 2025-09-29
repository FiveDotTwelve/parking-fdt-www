"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../utils/env");
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default(env_1.ENV.REDIS_URL);
exports.default = redis;
