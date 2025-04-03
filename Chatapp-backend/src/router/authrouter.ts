import express, { Router } from "express";
import {handleSignup} from "../controllers/signup";
import { handleSignIn } from "../controllers/signin";

export const authRouter: Router = express.Router();
//@ts-ignore
authRouter.post('/signup', handleSignup);
//@ts-ignore
authRouter.post('/signin',handleSignIn)