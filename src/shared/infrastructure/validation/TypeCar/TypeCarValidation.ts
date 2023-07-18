import multer from 'multer';

import { body,  } from 'express-validator';

import { RequestValidator } from '../RequestValidator';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication from '../ValidateAuthentication';

export class TypeCarValidations {

    private upload  = multer(multerConfig);


    readonly typeCarPhotoValidation = [
        validateAuthentication,
        this.upload.single('typeCar_image'),
    ]

}