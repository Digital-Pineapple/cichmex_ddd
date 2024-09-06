import multer from 'multer';
import { multerConfig } from '../../middleware/MulterConfig';


export class ProductValidations {

    private upload  = multer(multerConfig);

    readonly productValidation = [
       // this.upload.array('images', 3), // Subir hasta 3 imágenes
        this.upload.any(), // Subir un solo video
    ];
    readonly videoValidation = [
         this.upload.array('videos',1), 
     ];
    readonly proofOfPayment = [
        // this.upload.array('images', 3), // Subir hasta 3 imágenes
         this.upload.single('ticket'), // Subir un solo video
     ];
     readonly thumbnailValidation = [
        // this.upload.array('images', 3), // Subir hasta 3 imágenes
         this.upload.single('thumbnail'), // Subir un solo video
     ];
     readonly imagesValidation = [
         this.upload.any()
     ];
}