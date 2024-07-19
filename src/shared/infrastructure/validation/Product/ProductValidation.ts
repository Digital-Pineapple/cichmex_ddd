import multer from 'multer';
import { multerConfig } from '../../middleware/MulterConfig';


export class ProductValidations {

    private upload  = multer(multerConfig);

    readonly productValidation = [
       // this.upload.array('images', 3), // Subir hasta 3 imágenes
        this.upload.any(), // Subir un solo video
    ];
}