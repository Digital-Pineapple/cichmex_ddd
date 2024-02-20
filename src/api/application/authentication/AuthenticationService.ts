import Jwt from 'jsonwebtoken';
import Bcrypt from 'bcrypt';
import Generator from 'generate-password';
import { OAuth2Client } from 'google-auth-library';
import { UserEntity } from '../../domain/user/UserEntity';

export interface IGoogle {
    fullname    : string | undefined;
    email       : string | undefined;
    picture     : string | undefined;
    
}
export interface IGoogleRegister {
    fullname    : string | undefined;
    email       : string | undefined;
    code        ?: string | undefined;
}
export interface IGoogleResponse {
    user_id    : string ;
    verified      : boolean ;
    email : string;

}
export interface IGoogleReg {
    user_id    : string ;
    email : string;
    fullname : string;
    profile_image :string |undefined;

}
export interface IGoogleResponseLogin {
    user_id    : string ;
    verified      : boolean ;
    email : string;
    profile_image :string |undefined;
}


export interface IdUserAndVerified {
    user_id    :  string | undefined;
    verified   : string |undefined;
}
export interface IAuth {
    user    :  UserEntity | IGoogleReg;
    token?  : string;
}


export class Authentication {

    private googleKey   = process.env.GOOGLE_CLIENT_ID;
    private client      = new OAuth2Client(this.googleKey);

    protected async generateJWT(user: UserEntity | IGoogleReg  ): Promise<IAuth> {
        return new Promise((resolve, reject) => {
            const payload: string | object | Buffer = {user};

            Jwt.sign(payload, process.env.SECRET_JWT_KEY || '', {
                expiresIn: '24h',
            }, (error, token) => {
                if (error)  return reject('Error to generate JWT');
                resolve({ token, user });
            })

        });
    }

    protected async validateGoogleToken(token: string): Promise<IGoogle> {   
             
        return new Promise(async (resolve, reject) => {
            const ticket = await this.client.verifyIdToken({
                idToken : token,
                audience: this.googleKey,
            });
            if(!ticket) reject('El token de google no es valido');
            
            const payload = ticket.getPayload();
            resolve({ fullname: payload?.name, email: payload?.email, picture: payload?.picture});
        })
        
    }

    protected encryptPassword(password: string): string {
        const salt = Bcrypt.genSaltSync();
        return Bcrypt.hashSync(password, salt);
    }

    protected decryptPassword(password: string, encryptedPassword: string): boolean {
        return Bcrypt.compareSync(password, encryptedPassword);
    }

    protected generateRandomPassword() {
        return Generator.generate({
            length  : 16,
            numbers : true,
            symbols : true,
            strict  : true,
        })
    }
    protected validateToken() {
        return Generator.generate({
            length  : 16,
            numbers : true,
            symbols : true,
            strict  : true,
        })
    }

}