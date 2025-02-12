import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { BannerUseCase } from '../../../application/Banners/BannerUseCase';
import { BannerEntity } from '../../../domain/banners/BannerEntity';
import { MulterRequest } from '../../../../shared/infrastructure/middleware/express';

export class BannerController extends ResponseData {
    protected path = '/Banners';

    constructor(private bannerUseCase: BannerUseCase, private readonly s3Service: S3Service) {
        super();
        this.getAllBanners = this.getAllBanners.bind(this);
        this.getActiveBanners = this.getActiveBanners.bind(this);
        this.createOneBanner = this.createOneBanner.bind(this);
        this.getOneBanner = this.getOneBanner.bind(this);
        this.onActiveBanner = this.onActiveBanner.bind(this);
        this.deleteBanner = this.deleteBanner.bind(this) ;
        this.updateOneBanner = this.updateOneBanner.bind(this);


    }

    public async getAllBanners(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.bannerUseCase.getBanners()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getActiveBanners(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.bannerUseCase.getActiveBanners()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getOneBanner(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.bannerUseCase.getOneBanner(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async onActiveBanner(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { is_active } = req.body
        try {
            const response = await this.bannerUseCase.updateBanner(id, {is_active: is_active})
            this.invoke(response, 200, res, 'Se editó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al editar', 500));
        }
    }
    
    public async createOneBanner(req: Request, res: Response, next: NextFunction) {
        try {
          // Desestructuramos body y files para simplificar el acceso
          const { body, files } = req;
      
          // Construimos el objeto data a partir de req.body
          const data = {
            is_active: body.is_active === 'true',
            no_slide: body.no_slide, // Considera parseInt si lo necesitas como número
            for_discount: body.for_discount === 'true',
            title: body.title,
            description: body.description,
            type_event: body.type_event,
            ...(body.discount && body.discount.trim() !== ''
                ? { discount: body.discount }
                : {})
          };
      
          // Validamos la existencia de archivos
          if (!files) {
            return next(new ErrorHandler('Las imágenes son obligatorias', 400));
          }
      
          // Se crea el banner
          const bannerResponse: any = await this.bannerUseCase.createBanner(data);
      
          // Si se generó un error en la creación, se invoca el error
          if (bannerResponse instanceof ErrorHandler) {
            return this.invoke(bannerResponse, 400, res, 'Error al crear banner', next);
          }
      
          // Función auxiliar para procesar la subida y actualización de cada imagen
          const processImage = async (fileField: string, updateField: string) => {
            const fileArray  = files[fileField];
            if (fileArray && fileArray[0]) {
              const file = fileArray[0];
              const path = `${this.path}/${file.fieldname}/${bannerResponse._id}.webp`;
              const { url } = await this.s3Service.uploadToS3AndGetUrl(path, file, 'image/webp');
              const imageUrl = url.split('?')[0];
              await this.bannerUseCase.updateBanner(bannerResponse._id, { [updateField]: imageUrl });
              bannerResponse[updateField] = imageUrl;
            }
          };
      
          // Procesamos ambas imágenes de forma concurrente
          await Promise.all([
            processImage('image_slide', 'image_slide'),
            processImage('image_slide_movil', 'image_slide_movil')
          ]);
      
          // Invocamos la respuesta exitosa
          this.invoke(bannerResponse, 200, res, 'Se creó banner exitosamente', next);
        } catch (error) {
          console.error(error);
          next(new ErrorHandler('Hubo un error al editar', 500));
        }
      }

      public async updateOneBanner(req: Request, res: Response, next: NextFunction) {
        try {
          // Desestructurar los valores de req
          const { id } = req.params;
          const { body, files } = req;

          // Construir el objeto data
          const data = {
            is_active: body.is_active === 'true',
            no_slide: JSON.parse(body.no_slide),
            for_discount: body.for_discount === 'true',
            title: body.title,
            description: body.description,
            type_event: body.type_event,
            discount : body.for_discount === 'false' ? null : body.discount,
          };
          
      
          // Actualizar el banner
          const bannerResponse: any = await this.bannerUseCase.updateBanner(id, {...data});
      
          if (bannerResponse instanceof ErrorHandler) {
            return this.invoke(bannerResponse, 400, res, 'Error al actualizar banner', next);
          }
      
          // Asegurar que files es tratado correctamente
          const uploadedFiles = files as { [fieldname: string]: File[] };
      
          // Función auxiliar para procesar cada imagen
          const processImage = async (fileField: string, updateField: string) => {
            if (uploadedFiles[fileField] && Array.isArray(uploadedFiles[fileField]) && uploadedFiles[fileField].length > 0) {
              const file  = uploadedFiles[fileField][0];
              const path = `${this.path}/${file.fieldname}/${Date.now()}/${bannerResponse._id}.webp`;
              const { url } = await this.s3Service.uploadToS3AndGetUrl(path, file, 'image/webp');
              const imageUrl = url.split('?')[0];
      
              await this.bannerUseCase.updateBanner(bannerResponse._id, { [updateField]: imageUrl });
              bannerResponse[updateField] = imageUrl;
            }
          };
          
      
          // Filtrar solo los archivos que están presentes en req.files
          if (uploadedFiles) {
            const fileFieldsToProcess = ['image_slide', 'image_slide_movil'].filter(field => uploadedFiles[field]);
            await Promise.all(fileFieldsToProcess.map(field => processImage(field, field)));
          }
      
          // Enviar respuesta exitosa
          this.invoke(bannerResponse, 200, res, 'Se editó el banner exitosamente', next);
        } catch (error) {
          console.error(error);
          next(new ErrorHandler('Hubo un error al editar', 500));
        }
      }
      
      
      
      

    public async deleteBanner(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.bannerUseCase.deleteBanner(id)
            this.invoke(response, 200, res, 'Se eliminó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al eliminar', 500));
        }
    }




}

