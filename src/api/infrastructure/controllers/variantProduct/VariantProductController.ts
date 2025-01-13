import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { VariantProductUseCase } from '../../../application/variantProduct/VariantProductUseCase';
import { VariantProductEntity } from '../../../domain/variantProduct/variantProductEntity';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { ProductEntity } from '../../../domain/product/ProductEntity';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import { log } from 'console';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { randomUUID } from 'crypto';
import { generateUUID, RandomCodeId } from '../../../../shared/infrastructure/validation/Utils';
import { StockSHinputUseCase } from '../../../application/storehouse/stockSHinputUseCase';



export class VariantProductController extends ResponseData {
  protected path = '/variant-product';
  constructor(private readonly variantProductUseCase: VariantProductUseCase,
    private readonly stockStoreHouseUseCase: StockStoreHouseUseCase,
    private readonly stockSHinputUseCase : StockSHinputUseCase,
    private readonly s3Service: S3Service,

  ) {
    super();

    this.createVariant = this.createVariant.bind(this);
    this.updateVariant = this.updateVariant.bind(this);
    this.updateImages = this.updateImages.bind(this);
    this.deleteVariant = this.deleteVariant.bind(this);
    this.createVariantSize = this.createVariantSize.bind(this)
    this.deleteImageVariant = this.deleteImageVariant.bind(this)

  }

  public async createVariant(req: Request, res: Response, next: NextFunction): Promise<VariantProductEntity | ErrorHandler | void> {
    const { body } = req.body
    try {
      const response = await this.variantProductUseCase.CreateVariant(body)
      this.invoke(response, 200, res, '', next);
    } catch (error) {
      next(new ErrorHandler('Hubo un error al consultar la información', 500));
    }
  }

  public async createVariantSize(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const {body} = req.body; // Corregido acceso al cuerpo de la solicitud
    const { _id } = req.user;
    const stockParse = JSON.parse(body.stock)
  
    try {
      // Validación de datos entrantes
      if (!body.product_id || !body.color || !body.size || !stockParse) {
        return next(new ErrorHandler('Faltan datos obligatorios', 400));
      }
  
      // Buscar variantes existentes por producto
      const variants = await this.variantProductUseCase.findAllVarinatsByProduct(body.product_id);
  
      // Filtrar por color
      const mimeColor = variants?.filter((i: any) => i.attributes.color === body.color);
  
      if (!mimeColor || mimeColor.length === 0) {
        return next(new ErrorHandler('No se encontraron variantes para el color proporcionado', 404));
      }
  
      const images = mimeColor[0].images;
      const productId = mimeColor[0].product_id;
      const SH_id = '662fe69b9ba1d8b3cfcd3634';
      const folio = RandomCodeId('IN');
  
      // Valores para crear la variante
      const values = {
        product_id: productId,
        sku: generateUUID(),
        attributes: { color: body.color, size: body.size },
        design: body.design,
        images: images,
        price: body.price,
        discountPrice: body.discountPrice,
        porcentDiscount: body.porcentDiscount,
        weight: body.weight,
        tag: body.tag,
      };
  
      // Crear variante de producto
      const variant : any = await this.variantProductUseCase.CreateVariant(values);
  
      // Crear stock para la variante
      await this.stockStoreHouseUseCase.createStock({
        StoreHouse_id: SH_id,
        product_id: productId,
        variant_id: variant._id,
        stock: body.stock, // Corregido el error tipográfico
      });
  
      // Registrar entrada en el almacén
      await this.stockSHinputUseCase.createInput({
        folio: folio,
        SHStock_id: SH_id,
        quantity: body.stock,
        newQuantity: body.stock,
        responsible: _id,
        product_detail: productId,
      });
  
      // Enviar respuesta al cliente
      this.invoke(variant, 200, res, 'Se creó con éxito', next);
    } catch (error) {
      console.error('Error en createVariantSize:', error);
      next(new ErrorHandler('Hubo un error al procesar la solicitud', 500));
    }
  }
  

  public async updateVariant(req: Request, res: Response, next: NextFunction): Promise<VariantProductEntity | ErrorHandler | void> {
    const { id } = req.params
    const { body } = req.body
    const SH_id = '662fe69b9ba1d8b3cfcd3634';
    try {
      const stock = await this.stockStoreHouseUseCase.getVariantStock(id, SH_id)
      const response: any = await this.variantProductUseCase.UpdateVariant(id, { ...body })
      const AllResponse = { ...response._doc, stock: stock.stock || 0 }

      this.invoke(AllResponse, 200, res, 'Se editó con éxito', next);
    } catch (error) {
      next(new ErrorHandler('Hubo un error al consultar la información', 500));
    }
  }

  public async updateImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { color, product_id, images } = req.body;
    const SH_id = '662fe69b9ba1d8b3cfcd3634';

    try {


      if (!Array.isArray(images) || !req.files || !Array.isArray(req.files)) {
        throw new ErrorHandler('El cuerpo de la solicitud es inválido', 400);
      }

      // Obtener el índice máximo de `images` y `req.files`
      const imageIndices = images.reduce((indices, url, index) => {
        if (url !== undefined && url !== null) {
          indices.push(index);
        }
        return indices;
      }, []);
      const fileIndices = req.files.map((file: Express.Multer.File) => {
        const match = file.fieldname.match(/\[(\d+)\]/); // Extraer índice del nombre del campo
        return match ? parseInt(match[1], 10) : -1; // Retornar -1 si no hay coincidencia
      });

      const maxIndex = Math.max(...imageIndices, ...fileIndices, 0); // Asegurar un mínimo de 0

      // Crear un array de longitud segura
      const orderedImages = Array(maxIndex + 1).fill(null);

      // Reordenar las imágenes existentes
      images.forEach((url, index) => {
        if (url) {
          orderedImages[index] = url;
        }
      });

      // Procesar los archivos cargados y colocarlos en las posiciones correctas
      const fileUploadPromises = req.files.map(async (file: Express.Multer.File) => {
        const match = file.fieldname.match(/\[(\d+)\]/); // Extraer índice del fieldname
        const index = match ? parseInt(match[1], 10) : null;

        if (index !== null && index >= 0) {
          const uniqueFileName = `${Date.now()}-${color}-${index}`;
          const pathObject = `/product/${uniqueFileName}.webp`;
          const { url } = await this.s3Service.uploadToS3AndGetUrl(pathObject, file, "image/webp");
          orderedImages[index] = url.split("?")[0];
        }
      });

      // Esperar la subida de todos los archivos
      await Promise.all(fileUploadPromises);

      const finalOrderedImages = orderedImages
        .filter((image) => image !== null) // Elimina elementos nulos
        .map((url) => ({
          _id: new mongoose.Types.ObjectId(), // Genera un nuevo ObjectId para cada imagen
          url, // Asigna el string como valor de la propiedad `url`
          color, // Si es necesario, agrega la propiedad `color` desde el request
        }));

      const variants = await this.variantProductUseCase.findAllVarinatsByProduct(product_id);
      const filteredVariants = variants?.filter((variant: VariantProductEntity) => variant.attributes.color === color);

      const response = [];
      if (filteredVariants) {
        for (const variant of filteredVariants) {
          // Asegúrate de que estás enviando un array de objetos
          const res = await this.variantProductUseCase.UpdateVariant(variant._id, { images: finalOrderedImages });
          response.push(res);
        }
      }

      this.invoke(response, 200, res, 'Se actualizó con éxito', next);


    } catch (error) {
      console.error('Error en updateImages:', error);
      next(new ErrorHandler('Hubo un error al procesar las imágenes', 500));
    }
  }


  public async deleteVariant(req: Request, res: Response, next: NextFunction): Promise<VariantProductEntity | ErrorHandler | void> {
    const { id } = req.params
    const SH_id = '662fe69b9ba1d8b3cfcd3634';
    try {
      const stock = await this.stockStoreHouseUseCase.getVariantStock(id, SH_id)

      if (stock) {
        return next(new ErrorHandler('Elimina stock de variante', 400));
      }
      const response = await this.variantProductUseCase.UpdateVariant(id, { status: false })
      this.invoke(response, 200, res, 'Se eliminó con éxito', next);
    } catch (error) {
      next(new ErrorHandler('Hubo un error al eliminar la variante', 500));
    }
  }

  public async deleteImageVariant(
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