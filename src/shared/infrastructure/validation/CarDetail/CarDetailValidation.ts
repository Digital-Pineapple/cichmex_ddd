import multer from 'multer';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication from '../ValidateAuthentication';

export class CarDetailValidations {

    private upload  = multer(multerConfig);


    readonly carDetailPhotoValidation = [
        validateAuthentication,
        this.upload.single('carDetail_image'),
    ]

}