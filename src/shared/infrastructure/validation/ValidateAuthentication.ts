import { Request, Response, NextFunction } from 'express';

import Jwt, { verify } from 'jsonwebtoken';

import { config } from '../../../../config';

import { UserEntity } from '../../../api/domain/user/UserEntity';
import { ErrorHandler } from '../../domain/ErrorHandler';
import UserModel from '../../../api/infrastructure/models/UserModel';
import { verifyToken } from '../helpers/verifyToken';
import { Iuuid } from '../../../api/application/authentication/AuthenticationService';
import { TypeUserPopulateConfig } from '../../domain/PopulateInterfaces';

export const validateAuthentication = async(req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ').pop();
       
        if (!token) return next(new ErrorHandler('Token is required', 401));
        try {
            const { uuid } = Jwt.verify(token, config.SECRET_JWT_KEY) as { uuid: Iuuid };
            const userData = await UserModel.findOne({uuid:uuid, status:true})
            if (!userData) return next(new ErrorHandler('El usuario no es valido', 400));
            req.user = userData;
            next();
        } catch (error) {
            next(new ErrorHandler('Token no valido', 400));
        }
    }

    export const validateTokenRestorePassword = async(req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ').pop();
        if (!token) return next(new ErrorHandler('Token is required', 401));     
        try {
            const {data} = Jwt.verify(token, config.SECRET_JWT_KEY) as { data: UserEntity } ;

            
             const userData = await UserModel.findById(data);
           
            if (!userData) {
                throw new ErrorHandler('Usuario no encontrado', 404);
            }
            req.user = data;
            next();
        } catch (error) {
            
            next(new ErrorHandler('Token no valido', 400));
        }
    }



export const checkTypeUserAuth = (type_user: string | string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ').pop();
        if (!token) {
            throw new ErrorHandler('Token es requerido', 401);
        }  
        const {uuid} = await verifyToken(token);
        const userData = await UserModel.findOne({uuid:uuid}).populate(TypeUserPopulateConfig)
        if (!userData) {
            throw new ErrorHandler('Usuario no encontrado', 404);
        }
        const userTypes = Array.isArray(type_user) ? type_user : [type_user];
        const go = userTypes.some(e => userData.type_user?.role.includes(e))  
        if (!go) {
            throw new ErrorHandler('No tiene permisos necesarios', 403);
        }
        let id = userData._id.toHexString()
        let dataUser = userData.toObject()
        req.user= {...dataUser, id:id}
        
        next();
    } catch (error) {
        next(error); // Pasar el error original para una mejor depuración
    }
}

    
    

export default validateAuthentication;