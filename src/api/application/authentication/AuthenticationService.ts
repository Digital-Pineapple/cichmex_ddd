import Jwt from 'jsonwebtoken';
import Bcrypt from 'bcrypt';
import axios from 'axios';
import Generator from 'generate-password';
import { OAuth2Client } from 'google-auth-library';
import { UserEntity } from '../../domain/user/UserEntity';
import qs from 'qs';
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
    private redirectUri  =  process.env.REDIRECT_URI_LOGIN;   
    private redirectUriRegister  =  process.env.REDIRECT_URI_REGISTER;   
    private isSignIn : boolean = true;
    
    public async isSignUp(){
        this.isSignIn = false;
    }
    protected async getUrlTikTok(csrfState: string){
        let url = 'https://www.tiktok.com/v2/auth/authorize/';
        url += `?client_key=${this.tiktokKey}`;
        url += '&scope=user.info.basic';
        url += '&response_type=code';
        url += `&redirect_uri=${this.redirectUri}`;
        url += '&state=' + csrfState;
        return url;
    }

    protected async validateTikTokAccessToken(code: string){
        const url = 'https://open.tiktokapis.com/v2/oauth/token/';    
        const data = {
            grant_type: 'authorization_code',
            code: code,
            client_key: this.tiktokKey,
            client_secret: this.tiktokSecret,
            redirect_uri: this.redirectUri
        };                  
        try {
            const response = await axios.post(url, qs.stringify(data), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            });
            return response.data; // Devuelve solo los datos necesarios
        } catch (error) {
            console.error('Error al validar el token de acceso de TikTok:', error);
            throw new Error('Error al validar el token de acceso de TikTok'); // O maneja el error de otra forma
        }
    }

    protected async getUserInfoTikTok(accessToken: string){                           
        try{
            const url = "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name";
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }); 
            const user  = data.data.user;
            return user;
        }catch(error){
            throw new Error('Error al obtener la información del usuario de TikTok');
        }        
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