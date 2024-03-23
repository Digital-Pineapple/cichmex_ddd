import multer from 'multer';
import { multerConfig } from '../../middleware/MulterConfig';
import validateAuthentication from '../ValidateAuthentication';

export class PaymentValidations {

    private upload  = multer(multerConfig);

    readonly paymentValidation = [
        this.upload.array('values')
    ]

}