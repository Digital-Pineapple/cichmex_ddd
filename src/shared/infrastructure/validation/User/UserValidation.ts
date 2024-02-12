import multer from 'multer';

import { body } from 'express-validator';

import { RequestValidator } from '../RequestValidator';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication, { checkTypeUserAuth } from '../ValidateAuthentication';

export class UserValidations {

    private upload  = multer(multerConfig);


    readonly ImageValidation = [
        validateAuthentication,
        this.upload.single('profile_image'),
    ]

    readonly authTypeUserValidation = (type_user: string | string[]) => [
        checkTypeUserAuth(Array.isArray(type_user) ? type_user : [type_user])
    ];


}