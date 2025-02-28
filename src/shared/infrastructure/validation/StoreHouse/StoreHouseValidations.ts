import multer from 'multer';
import { multerConfig } from '../../middleware/MulterConfig';

export class StoreHouseValidations {

    private upload  = multer(multerConfig);


    readonly imagesValidation = [
        this.upload.any()
    ]

}