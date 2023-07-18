import multer from 'multer';

import { body,  } from 'express-validator';

import { RequestValidator } from '../RequestValidator';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication from '../ValidateAuthentication';

export class SubCategoryValidations {

    private upload  = multer(multerConfig);


    readonly subCategoryPhotoValidation = [
        validateAuthentication,
        this.upload.single('image'),
    ]

}