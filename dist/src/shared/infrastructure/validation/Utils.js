"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomCodeId = exports.generateUUID = exports.generateRandomCode = void 0;
const generate_password_1 = __importDefault(require("generate-password"));
const uuid_1 = require("uuid");
const generateRandomCode = () => generate_password_1.default.generate({
    length: 6,
    numbers: true,
    lowercase: false,
    uppercase: false
});
exports.generateRandomCode = generateRandomCode;
const generateUUID = () => (0, uuid_1.v4)({});
exports.generateUUID = generateUUID;
const RandomCodeId = (prefix) => {
    let code = generate_password_1.default.generate({
        length: 6,
        numbers: true,
        lowercase: false,
        uppercase: true,
        excludeSimilarCharacters: true
    });
    let data = prefix + '-' + code;
    return data.toString();
};
exports.RandomCodeId = RandomCodeId;
