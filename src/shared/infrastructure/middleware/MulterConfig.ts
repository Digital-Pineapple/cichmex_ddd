import { Request } from 'express';
import multer, { FileFilterCallback } from "multer";

type FileNameCallback = (error: Error | null, filename: string) => void

export const multerConfig = {
    storage: multer.diskStorage({
        filename: function (req: Request, file: Express.Multer.File, cb: FileNameCallback) {
            cb(null, file.originalname);
        },
    }),

    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        cb(null, true);
    },

    // Aumentar el límite de tamaño de archivo a 50 MB
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB
    },
}
