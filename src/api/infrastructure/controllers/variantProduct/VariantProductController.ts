import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { VariantProductUseCase } from '../../../application/variantProduct/VariantProductUseCase';
import { VariantProductEntity} from '../../../domain/variantProduct/variantProductEntity';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { ProductEntity } from '../../../domain/product/ProductEntity';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';



export class VariantProductController extends ResponseData {
    protected path = '/variant-product';    
    constructor(private readonly variantProductUseCase: VariantProductUseCase,
      private readonly stockStoreHouseUseCase: StockStoreHouseUseCase,
             
    ) {
        super();
        
        this.createVariant = this.createVariant.bind(this);
        this.deleteVariant = this.deleteVariant.bind(this);
        this.deleteImageVariant = this.deleteImageVariant.bind(this)

    }

    public async createVariant(req: Request, res: Response, next: NextFunction): Promise<VariantProductEntity | ErrorHandler | void> {
        const {body} = req.body
        try {
            const response = await this.variantProductUseCase.CreateVariant(body)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async deleteVariant(req: Request, res: Response, next: NextFunction): Promise<VariantProductEntity | ErrorHandler | void> {
        const {id} = req.params
        const SH_id = '662fe69b9ba1d8b3cfcd3634';
        try {
          const stock = await this.stockStoreHouseUseCase.getVariantStock(id,SH_id)
          
          if (stock) {
            return next(new ErrorHandler('Elimina primero el stock del producto', 400));
          }
            const response = await this.variantProductUseCase.UpdateVariant(id,{status:false})
            this.invoke(response, 200, res, 'Se eliminó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al eliminar la variante', 500));
        }
    }

    public async    deleteImageVariant(
        req: Request, 
        res: Response, 
        next: NextFunction
      ): Promise<void> {
        const { id } = req.params; // ID de la variante
        const { image_id } = req.body; // ID de la imagen a eliminar
      
        if (!id || !image_id) {
          return next(new ErrorHandler('ID de variante o imagen no proporcionado', 400));
        }
      
        try {
          // Buscar la variante
          const response: any = await this.variantProductUseCase.findVariantById(id);
      
          if (!response) {
            return next(new ErrorHandler('Variante no encontrada', 404));
          }
      
          // Filtrar para excluir la imagen con el ID especificado
          const updatedImages = response.images.filter((image: any) => image._id.toString() !== image_id);
      
          // Actualizar la variante con las imágenes restantes
          const updatedVariant = await this.variantProductUseCase.UpdateVariant(id, { images: updatedImages });
      
          // Responder con éxito
          this.invoke(updatedVariant, 200, res, 'Se eliminó la imagen con éxito', next);
        } catch (error) {
          console.error('Error al eliminar la imagen:', error);
          next(new ErrorHandler('Hubo un error al eliminar la imagen de la variante', 500));
        }
      }
      







}