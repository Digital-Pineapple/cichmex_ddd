import multer from 'multer';

import { body } from 'express-validator';

import { RequestValidator } from '../RequestValidator';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication from '../ValidateAuthentication';

export class BranchOfficeValidations {

    private upload  = multer(multerConfig);


    readonly ImageValidation = [
        this.upload.array('images',3),
    ]

}