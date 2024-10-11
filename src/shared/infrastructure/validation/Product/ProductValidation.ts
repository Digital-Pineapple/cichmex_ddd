import multer from 'multer';
import { multerConfig } from '../../middleware/MulterConfig';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Asignar la ruta de ffmpeg a fluent-ffmpeg
ffmpeg.setFfmpegPath(ffmpegStatic!);

export class ProductValidations {
    private upload = multer(multerConfig);

    // Validación para productos (ejemplo con videos)
    readonly productValidation = [
        this.upload.any(), // Permite subir cualquier archivo
        this.validateVideoVertical, // Validación del video vertical
    ];

    // Validación para subir un solo video
    readonly videoValidation = [
        this.upload.array('videos', 1), 
        this.validateVideoVertical, // Validación del video vertical
    ];

    // Validación para comprobante de pago
    readonly proofOfPayment = [
        this.upload.single('ticket'), 
    ];

    // Validación para miniatura (thumbnail)
    readonly thumbnailValidation = [
        this.upload.single('thumbnail'), 
    ];

    // Validación para subir una sola imagen
    readonly imagesValidation = [
        this.upload.single('image'),
    ];

    // Método para validar si el video subido es vertical
    private validateVideoVertical(req: Request, res: Response, next: NextFunction) {
        // Verifica si se ha subido algún archivo
        const files = req.files as Express.Multer.File[] | undefined;
        
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No se ha subido ningún video.' });
        }

        const videoFile = files[0]; // En este caso solo manejamos un archivo de video
        
        const rutaVideo = path.resolve(videoFile.path);

        ffmpeg.ffprobe(rutaVideo, (err, metadata) => {
            if (err) {
                return res.status(500).json({ error: 'Error al procesar el video.' });
            }

            const ancho = metadata.streams[0].width;
            const alto = metadata.streams[0].height;

            if (ancho && alto) {
                if (alto > ancho) {
                    // Si el video es vertical, continúa con el siguiente middleware
                    next();
                } else {
                    // Si el video no es vertical, responde con un error
                    fs.unlink(rutaVideo, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error al eliminar el archivo:', unlinkErr);
                        }
                    });
                    return res.status(400).json({ error: 'El video debe ser vertical.' });
                }
            } else {
                return res.status(500).json({ error: 'No se pudieron obtener las dimensiones del video.' });
            }
        });
    }
}
