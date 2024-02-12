const UserModel = require("../../../../api/infrastructure/models/UserModel");
const jwt = require('jsonwebtoken');
const config = require('../../../../../config');
const { ErrorHandler } = require("../../../../shared/domain/ErrorHandler");

export const comprobarJWT = async (token = '') => {
    console.log(token);
    
    try {
        if (token.length < 10) {
            return null;
        }

        const { user } = jwt.verify(token, config.SECRET_JWT_KEY);

        if (!user) {
            throw new ErrorHandler(401, 'Token de autenticación inválido');
        }

        const usuario = await UserModel.findById(user._id);

        if (usuario) {
            return usuario;
        } else {
            return null;
        }

    } catch (error) {
        console.error(error);
        throw new ErrorHandler(500, 'Error al comprobar el token JWT');
    }
};






