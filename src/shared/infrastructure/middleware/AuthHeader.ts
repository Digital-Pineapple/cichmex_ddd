import { Response, Request, NextFunction } from "express";

export const AuthHeader = (req:Request,res:Response, next:NextFunction)=>{
console.log(req.headers);


}