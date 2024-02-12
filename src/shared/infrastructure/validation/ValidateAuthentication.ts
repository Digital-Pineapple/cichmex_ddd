import { Request, Response, NextFunction } from 'express';

import Jwt, { verify } from 'jsonwebtoken';

import { config } from '../../../../config';

import { UserEntity } from '../../../api/domain/user/UserEntity';
import { ErrorHandler } from '../../domain/ErrorHandler';
import UserModel from '../../../api/infrastructure/models/UserModel';
import { verifyToken } from '../helpers/verifyToken';
import { ObjectId } from 'mongodb';

export const validateAuthentication = (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('token');
        if (!token) return next(new ErrorHandler('Token is required', 401));
        try {
            const { user } = Jwt.verify(token, config.SECRET_JWT_KEY) as { user: UserEntity };
            if (!user) return next(new ErrorHandler('El usuario no es valido', 400));
            req.user = user;
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
        
        const tokenData = await verifyToken(token);
        
        const userData = await UserModel.findById(tokenData.user._id);

        if (!userData) {
            throw new ErrorHandler('Usuario no encontrado', 404);
        }

        const userTypes = Array.isArray(type_user) ? type_user : [type_user];
        
        // Convertir userData.type_user a ObjectId si es un string
        const userTypeString = userData.type_user instanceof ObjectId ? userData.type_user.toString() : userData.type_user;
        
        if (!userTypes.includes(userTypeString)) {
            throw new ErrorHandler('No tiene permisos necesarios', 403);
        }

        next();
    } catch (error) {
        next(error); // Pasar el error original para una mejor depuración
    }
}

    
    

export default validateAuthentication;