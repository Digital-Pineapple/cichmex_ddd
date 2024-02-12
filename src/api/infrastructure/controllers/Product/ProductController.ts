import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ProductUseCase } from "../../../application/product/productUseCase";
import { S3Service } from "../../../../shared/infrastructure/aws/S3Service";
import { stringify } from 'uuid';

export class ProductController extends ResponseData {
  protected path = "/product";

  constructor(
    private productUseCase: ProductUseCase,
    private readonly s3Service: S3Service
  ) {
    super();
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  public async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productUseCase.getProducts();
  
      const updatedResponse = await Promise.all(
        response.map(async (item: any) => {
          const images = item.images;
          const updatedImages = await Promise.all(
            images.map(async (image: any) => {
              const url = await this.s3Service.getUrlObject(
                image + ".jpg"
              );
              return url;
            })
          );
          item.images = updatedImages;
          return item;
        })
      );
  
      this.invoke(updatedResponse, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }
  

  public async getProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const response = await this.productUseCase.getProduct(id);
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }

  public async createProduct(req: Request, res: Response, next: NextFunction) {
    const {  name,
        price,
        description,
        sizes,
        tag,
     } = req.body;
    
    try{
      const createSlug = (slug: string): string => {
        // Reemplazar caracteres especiales por espacios y convertir a minúsculas
        let processedSlug = slug.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLowerCase();
        
        // Eliminar espacios al principio y al final
        processedSlug = processedSlug.trim();
      
        // Reemplazar espacios internos con guiones
        processedSlug = processedSlug.replace(/\s+/g, '_');
      
        return processedSlug;
      };
      
      const slug =createSlug(name)
      console.log(slug);
      

    const response = await this.productUseCase.createProduct( name,
        price,
        description,
        sizes,
        tag,
        slug
        )
   this.invoke(response, 201, res, 'Se creó con éxito', next);
   }
   catch (error) {
       console.log(error);
       next(new ErrorHandler('Hubo un error al crear', 500));
   }

}


public async updateProduct(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const { name, price, description, slug, sizes, tag } = req.body;
  console.log(req);
  
  console.log(req.files);
  
  
  try {
    if (req.files && req.files.length > 0) {
      const paths: string[] = [];
      const urls: string[] = [];
      await Promise.all(req.files.map(async (item: any, index: number) => {
        const pathObject: string = `${this.path}/${id}/${index}`;
        const {url}=   await this.s3Service.uploadToS3AndGetUrl(
          pathObject + ".jpg",
          item,
          "image/jpeg"
        );
        paths.push(pathObject);
        urls.push(url)
      }));

      const response = await this.productUseCase.updateProduct(id, {
        slug,
        name,
        price,
        description,
        sizes,
        tag,
        images: paths,
      });
      response.images = urls
      this.invoke(response, 201, res, 'Se actualizó con éxito', next);
    } else {
      // Si no hay nuevos archivos, simplemente actualiza el producto sin cambios en las imágenes
      const response = await this.productUseCase.updateProduct(id, {
        name,
        price,
        description,
        slug,
        sizes,
        tag,
      });

      this.invoke(response, 201, res, 'Se actualizó con éxito', next);
    }
  } catch (error) {
    console.error(error);
    next(new ErrorHandler('Hubo un error al actualizar', 500));
  }
}


  public async deleteProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const response = await this.productUseCase.deleteProduct(id);
      this.invoke(response, 201, res, "Eliminado con exito", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error eliminar", 500));
    }
  }
}
