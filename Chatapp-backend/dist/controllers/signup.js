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
exports.handleSignup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const prismaclient_1 = require("../utils/prismaclient");
const signupschema = zod_1.z.object({
    Email: zod_1.z.string().email(),
    Username: zod_1.z.string().min(3),
    Password: zod_1.z.string().min(3),
});
const handleSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Email, Username, Password } = req.body;
        const result = signupschema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error });
        }
        const findexisting = yield prismaclient_1.prisma.user.findFirst({
            where: {
                email: result.data.Email
            }
        });
        if (findexisting) {
            return res.status(400).json({ errors: "User already exists" });
        }
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(result.data.Password, saltRounds);
        const createuser = yield prismaclient_1.prisma.user.create({
            data: {
                email: result.data.Email,
                password: hashedPassword,
                username: result.data.Username
            }
        });
        res.redirect('/chat');
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.errors }); // Return validation errors
        }
        else {
            return res.status(500).json({ errors: 'internal server error' });
        }
    }
});
exports.handleSignup = handleSignup;
