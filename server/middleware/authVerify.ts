import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request{
    user:{
        id:string,
        email:string,
        phoneNumber:string,
        role: string
    }
}

export const authVerify = ( req:AuthRequest, res:Response, next:NextFunction)=>{
    try {
        const authHeader = req.headers["authorization"];

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({success: false, message:"No token provide and invalid format"});
        }

        const token = authHeader.split(" ")[1];
        

        // verify token
        const secret = process.env.SECRET_KEY;
        const decoded = jwt.verify(token,secret);

        req.user=decoded;
        next();
        
    } catch (error:any) {
        console.error("JWT verify error",error.message);
        return res.status(403).json({
            success: false,
            message: "Invalid Or expired token"
        })
    }
   
}