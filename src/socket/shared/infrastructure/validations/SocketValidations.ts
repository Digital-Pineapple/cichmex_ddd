import UserModel from "../../../../api/infrastructure/models/UserModel";

const jwt = require('jsonwebtoken');
import{config} from '../../../../../config'
import { UserEntity } from "../../../../api/domain/user/UserEntity";
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";



export const comprobarJWT = async( token = '') => {
    console.log(token);
    

    try {
        
        if(  token.length < 10 ) {
            return null;
        }

        const { user } = jwt.verify( token, config.SECRET_JWT_KEY )as {user:UserEntity};
        if (!token) {
            return null
        }
        
        const usuario = await UserModel.findById( user._id );

        if ( usuario ) {
            return usuario
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }

}





