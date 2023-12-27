import multer from 'multer';

import { body } from 'express-validator';

import { RequestValidator } from '../RequestValidator';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication from '../ValidateAuthentication';

export class ProductValidations {

    private upload  = multer(multerConfig);

    readonly productValidation = [
        this.upload.array('images',3)
    ]

}