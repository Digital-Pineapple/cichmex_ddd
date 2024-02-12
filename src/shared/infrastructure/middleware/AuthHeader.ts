import { Response, Request, NextFunction } from "express";

const {verifyToken} = require('../helpers/verifyToken')

export const AuthHeader = async (req:Request,res:Response, next:NextFunction)=>{
    // TODO: authorization : Barer 100101010
 try {
    const token = req.headers.authorization?.split(' ').pop() //Todo:1231112
    const tokenData = await verifyToken(token)
    
 } catch (error) {
    
 }


}