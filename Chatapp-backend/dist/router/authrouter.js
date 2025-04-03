"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const signup_1 = require("../controllers/signup");
const signin_1 = require("../controllers/signin");
exports.authRouter = express_1.default.Router();
//@ts-ignore
exports.authRouter.post('/auth/signup', signup_1.handleSignup);
//@ts-ignore
exports.authRouter.post('/auth/signin', signin_1.handleSignIn);
