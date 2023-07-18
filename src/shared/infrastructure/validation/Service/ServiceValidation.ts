import multer from 'multer';

import { body,  } from 'express-validator';

import { RequestValidator } from '../RequestValidator';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication from '../ValidateAuthentication';

export class ServiceValidations {

    private upload  = multer(multerConfig);


    readonly servicePhotoValidation = [
        validateAuthentication,
        this.upload.single('service_image'),
    ]

}