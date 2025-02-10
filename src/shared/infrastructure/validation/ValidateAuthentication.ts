import { Request, Response, NextFunction } from 'express';

import Jwt, { verify } from 'jsonwebtoken';

import { config } from '../../../../config';

import { UserEntity } from '../../../api/domain/user/UserEntity';
import { ErrorHandler } from '../../domain/ErrorHandler';
import UserModel from '../../../api/infrastructure/models/UserModel';
import { verifyToken } from '../helpers/verifyToken';
import { Iuuid } from '../../../api/application/authentication/AuthenticationService';
import { TypeUserPopulateConfig } from '../../domain/PopulateInterfaces';
import axios from 'axios';

export const validateAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ').pop();

    if (!token) return next(new ErrorHandler('Token is required', 401));

    try {
        const { uuid } = Jwt.verify(token, config.SECRET_JWT_KEY) as { uuid: string };

        const userData = await UserModel.findOne({ uuid, status: true });
        if (!userData) return next(new ErrorHandler('El usuario no es válido', 400));
        const id = userData._id.toHexString();
        const dataUser = userData.toObject();
        req.user = { ...dataUser, id };
        next();
    } catch (error) {

        if (error === 'TokenExpiredError') {
            return next(
                new ErrorHandler('El token ha expirado', 498)
            );
        }
        return next(new ErrorHandler('Token no válido', 400));
    }
};


export const validateTokenRestorePassword = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ').pop();
    if (!token) return next(new ErrorHandler('Token is required', 401));
    try {
        const { data } = Jwt.verify(token, config.SECRET_JWT_KEY) as { data: UserEntity };


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

        const tokenResult = await verifyToken(token);

        // Manejar errores específicos del token
        if (tokenResult.error) {
            if (tokenResult.error === 'Token expirado') {
                throw new ErrorHandler('El token ha expirado', 498);
            }
            throw new ErrorHandler('Token inválido o no autorizado', 401);
        }

        const { uuid } = tokenResult;
        const userData = await UserModel.findOne({ uuid }).populate(TypeUserPopulateConfig);
        
        if (!userData) {
            throw new ErrorHandler('Usuario no encontrado', 404);
        }

        const userTypes = Array.isArray(type_user) ? type_user : [type_user];
        const hasPermission = userTypes.some(role => userData.type_user?.role.includes(role));

        if (!hasPermission) {
            throw new ErrorHandler('No tiene permisos necesarios', 403);
        }

        const id = userData._id.toHexString();
        const dataUser = userData.toObject();
        req.user = { ...dataUser, id };
        next();
    } catch (error) {
        next(error); // Pasar el error al manejador global de errores
    }
};

export const  verifyCaptcha = async (token : any) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Reemplaza con tu secret key
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  
    try {
      const response = await axios.post(url);
      return response.data.success; // Si la verificación es exitosa, devuelve true
    } catch (error) {
      return false;
    }
  };



export default validateAuthentication;