"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlug = exports.RandomCodeShipping = exports.RandomCodeId = exports.generateUUID = exports.generateRandomCode = void 0;
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
const RandomCodeShipping = () => generate_password_1.default.generate({
    length: 4,
    numbers: true,
    lowercase: true,
    uppercase: true
});
exports.RandomCodeShipping = RandomCodeShipping;
const createSlug = (slug) => {
    let processedSlug = slug
        .replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ') // Caracteres especiales
        .toLowerCase() // Minúsculas
        .trim() // Espacios al principio y al final
        .replace(/\s+/g, '_'); // Reemplazo de espacios con guiones bajos
    return processedSlug;
};
exports.createSlug = createSlug;
