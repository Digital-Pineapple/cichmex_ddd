import multer from 'multer';

import { body,  } from 'express-validator';

import { RequestValidator } from '../RequestValidator';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication from '../ValidateAuthentication';

export class CategoryValidations {

    private upload  = multer(multerConfig);


    readonly categoryPhotoValidation = [
        this.upload.single('image'),
    ]

}