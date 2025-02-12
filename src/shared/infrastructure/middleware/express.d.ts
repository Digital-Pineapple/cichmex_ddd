import {Request } from 'express'
interface MulterRequest extends Request {
    files: {
        image_slide: Express.Multer.File[];
        image_slide_movil: Express.Multer.File[];
    };
}