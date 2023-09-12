import multer from 'multer';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication from '../ValidateAuthentication';

export class ServicesCustomerValidations {

    private upload  = multer(multerConfig);


    readonly servicePhotoValidation = [
        validateAuthentication,
        this.upload.single('services'),
    ]

}