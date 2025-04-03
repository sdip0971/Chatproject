"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authrouter_1 = require("./router/authrouter");
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
(0, dotenv_1.config)(); // Call the function to load environment variables
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.Origin,
    methods: ['GET', "POST", "PATCH", "PUT", "DELETE"],
    credentials: true
}));
app.use(authrouter_1.authRouter);
const port = 3000; // Define the port variable
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
