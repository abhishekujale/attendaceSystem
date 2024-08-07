import jwt from 'jsonwebtoken';
import { Request,Response,NextFunction } from "express";
import {z} from "zod"
interface JwtPayload {
    id: string; 
}
export const authenticatejwt=(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) return res.status(401).send({success:false,error:new Error("No token exists"),message:"No token exists"})
        const {id}=jwt.verify(token,process.env.JWTPRIVATEKEY as string) as JwtPayload
        req.headers.id=id;
        next()
    }catch(err)
    {
        console.log(err)
        return res.status(401).send({success:false,error:err,message:"Authentication failed"})
    }
}

export const generateAuthToken = function(id:any){
    const token = jwt.sign({id}, process.env.JWTPRIVATEKEY!);
    return token;
}

const passwordComplexity = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const loginValidate = (data: any) => {
    const schema = z.object({
      email: z
        .string()
        .email({ message: 'Please enter a valid email address' })
        .min(1,{ message: 'Email is required' }),
      password: passwordComplexity
        .min(1,{ message: 'Password is required' }),
    });
  
    try {
      schema.parse(data);
      return { error: null };
    } catch (e:any) {
      return { error: e.errors };
    }
  };