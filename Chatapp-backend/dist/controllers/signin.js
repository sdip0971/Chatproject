"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSignIn = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaclient_1 = require("../utils/prismaclient");
const dotenv_1 = require("dotenv"); // Correctly import config from dotenv
(0, dotenv_1.config)(); // Call config to load environment variables
const signupschema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(3),
});
const validatepass = (hashedpass, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatch = yield bcrypt_1.default.compare(password, hashedpass);
    return isMatch;
});
const handleSignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ errors: "Pls enter valid credentials" });
        }
        const result = signupschema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error });
        }
        const User = yield prismaclient_1.prisma.user.findFirst({
            where: {
                email: result.data.email,
            },
        });
        if (!User) {
            return res.status(400).json({ errors: "User doesn't exist" });
        }
        const match = yield validatepass(User.password, password); // Await the validation function
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const maxAge = 3 * 24 * 60 * 60 * 1000;
        const JWT_SECRET = process.env.JWT_KEY || "";
        const token = yield jsonwebtoken_1.default.sign({ userid: User.email, username: User.username }, JWT_SECRET);
        res.cookie('token', token, {
            maxAge,
            secure: true,
            sameSite: "none"
        });
        res.redirect("/chat");
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.errors }); // Return validation errors
        }
        else {
            return res.status(500).json({ errors: "internal server error" });
        }
    }
});
exports.handleSignIn = handleSignIn;
