"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.saveToken = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const redis_1 = __importDefault(require("../configs/redis"));
const saveToken = async (userId, tokens) => {
    try {
        await redis_1.default.set(`fdtparking:google_token:${userId}`, JSON.stringify(tokens));
        console.log(`✅ Token saved for user: ${userId}`);
    }
    catch (err) {
        console.error('❌ Error saving token to Redis:', err);
        console.log('❌ Error saving token to Redis:', err);
    }
};
exports.saveToken = saveToken;
const getToken = async (userId) => {
    try {
        const data = await redis_1.default.get(`fdtparking:google_token:${userId}`);
        if (!data)
            return null;
        return JSON.parse(data);
    }
    catch (err) {
        console.error('❌ Error getting token from Redis:', err);
        return null;
    }
};
exports.getToken = getToken;
