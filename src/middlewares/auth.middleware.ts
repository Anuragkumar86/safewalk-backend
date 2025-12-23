import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"

interface USER{
    id: string,
    name: string,
    email: string
}
const JWT_SECRET = process.env.JWT_SECRET;
export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try{

        const token = req.headers.authorization?.split(" ")[1] as string;
        // console.log("Token: ", token)
        const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload
        // console.log("DECODED: ",decoded)
        
        req.user = {
            id: decoded.userId,

        };
        next()
    }
    catch(err){
        
        res.status(401).json({ message: "Invalid token" });
        
    }
}