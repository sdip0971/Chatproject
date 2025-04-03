import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaclient";
import { config } from "dotenv"; // Correctly import config from dotenv

config(); // Call config to load environment variables

const signinschema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

const validatepass = async (hashedpass: string, password: string) => {
  const isMatch = await bcrypt.compare(password, hashedpass);
  return isMatch;
};

export const handleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ errors: "Pls enter valid credentials" });
    }

    const result = signinschema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    const User = await prisma.user.findFirst({
      where: {
        email: result.data.email,
      },
    });

    if (!User) {
      return res.status(400).json({ errors: "User doesn't exist" });
    }

    const match = await validatepass(User.password, password); // Await the validation function
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const maxAge = 3*24*60*60*1000;
    const JWT_SECRET = process.env.JWT_KEY || ""
    const token = await jwt.sign(
      { userid: User.email, username: User.username },
      JWT_SECRET,
      { expiresIn: "3d" }
    );
    res.cookie('token',token,{
        maxAge,
        sameSite:"none",
        httpOnly:true,
        secure:true
    })
  
  return res.status(200).json({
   
      user:{
        id:User.id,
        email:User.email,
        username:User.username,
        profileSetup:User.profilesetup,
        image:User.image,
      },
      token:token
    
  })

  
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors }); // Return validation errors
    } else {
      return res.status(500).json({ errors: "internal server error" });
    }
  }
};