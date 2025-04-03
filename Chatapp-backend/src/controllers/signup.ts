import { Request, Response, NextFunction, response } from "express";
import bcrypt from "bcrypt"; 
import { z } from "zod";
import { prisma } from "../utils/prismaclient";


const signupschema = z.object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(3),
});

export const handleSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        const { email, username, password } = req.body;

        const result = signupschema.safeParse(req.body);
        
       if (!result.success) {
         return res.status(400).json({
           errors: result.error.errors.map((err) => ({
             path: err.path.join("."),
             message: err.message,
           })),
         });
       }

        const findexisting = await prisma.user.findFirst({
            where: {
                email: result.data.email
            }
        })

        if (findexisting) {
            return res.status(400).json({ errors: "User already exists" });
        }
        
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(result.data.password, saltRounds);

        const createuser = await prisma.user.create({
            data: {
                email: result.data.email,
                password: hashedPassword,
                username: result.data.username
            }
        });
       
       return res.status(201).json({
        data:{
            message:"signed up succesfully"
        }
       })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors }); // Return validation errors
        } else {
            console.log(error)
            return res.status(500).json({ errors:error  });
        }
    }
};