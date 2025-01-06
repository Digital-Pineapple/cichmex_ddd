import multer from 'multer';

import { body,  } from 'express-validator';

import { RequestValidator } from '../RequestValidator';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication from '../ValidateAuthentication';

export class DocumentationValidations {

    private upload  = multer(multerConfig);


    readonly DocumentationFileValidation = [
        validateAuthentication,
        this.upload.single('url'),
    ]

    readonly PDFFileValidation = [
        validateAuthentication,
        this.upload.single('guide_pdf'),
    ]

}