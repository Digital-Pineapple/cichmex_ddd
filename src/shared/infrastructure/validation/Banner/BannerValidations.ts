import multer from 'multer';
import { multerConfig } from '../../middleware/MulterConfig';

export class BannerValidations {

    private upload = multer(multerConfig); 

    readonly ImagesValidation = [
        this.upload.fields([
            { name: 'image_slide', maxCount: 1 },
            { name: 'image_slide_movil', maxCount: 1 }
        ])
    ]


}
