import Jwt from 'jsonwebtoken';
import Bcrypt from 'bcrypt';
import axios from 'axios';
import Generator from 'generate-password';
import { OAuth2Client } from 'google-auth-library';
import { UserEntity } from '../../domain/user/UserEntity';
import { TokenEntity, TokenRPEntity } from '../../domain/auth/authEntities';

export interface IFacebook {
    id          : string | undefined;
    name        : string | undefined;
    last_name   : string | undefined;
    email       : string | undefined;
    picture     : string | undefined;
}
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
    _id    : string ;
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
    user    :  UserEntity | IGoogleReg | Iuuid;
    token?  : string;
}

export interface Iuuid {
    uuid : string;

}



export class Authentication {   

    private googleKey   = process.env.GOOGLE_CLIENT_ID;
    private client      = new OAuth2Client(this.googleKey);
    private tiktokKey   = process.env.TIKTOK_CLIENT_ID;
    private tiktokSecret = process.env.TIKTOK_CLIENT_SECRET; 
    // private redirectUri  = "https://localhost:4000/" 
    private redirectUri  = "https://test.cichmex.mx/" 
    
    protected async redirectToTikTok(csrfState: string){
        let url = 'https://www.tiktok.com/v2/auth/authorize/';
        url += `?client_key=${this.tiktokKey}`;
        url += '&scope=user.info.basic';
        url += '&response_type=code';
        url += `&redirect_uri=${this.redirectUri}`;
        url += '&state=' + csrfState;
        return url;
    }

    protected async generateJWT(user: UserEntity | IGoogleReg , uuid: Iuuid ): Promise<IAuth> {
        return new Promise((resolve, reject) => {
            const payload: string | object | Buffer = {uuid};
            Jwt.sign(payload, process.env.SECRET_JWT_KEY || '', {
                expiresIn: '24h',
            }, (error, token) => {
                if (error)  return reject('Error to generate JWT');
                resolve({ token, user });
            })

        });
    }
    protected async generateJWTRP(data: any): Promise<TokenRPEntity> {
        return new Promise((resolve, reject) => {
            const payload: string | object | Buffer = {data};

            Jwt.sign(payload, process.env.SECRET_JWT_KEY || '', {
                expiresIn: '24h',
            }, (error, token) => {
                if (error)  return reject('Error to generate JWT');
                resolve({token});
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
            resolve({ fullname: payload?.name, email: payload?.email, picture: payload?.picture, });
        })
        
    }

    protected async validateFacebookToken(token: string): Promise<IFacebook> {
        const url = `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture,last_name`;
        return new Promise(async(resolve, reject)=>{
            try{
                const response = await axios.get(url);
                const userData = response.data;              
                resolve(userData);
            }catch(error){
                reject("Error al validar el token de facebook");
            }
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