import { IProductInput } from './../../../domain/stockBranch/StockBranchEntity';
import { CategoryUseCase } from './../../../application/category/CategoryUseCase';
import { body } from 'express-validator';
import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ProductUseCase } from "../../../application/product/productUseCase";
import { S3Service } from "../../../../shared/infrastructure/aws/S3Service";
import { stringify } from 'uuid';
import { errorMonitor } from 'nodemailer/lib/xoauth2';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import { ProductEntity } from '../../../domain/product/ProductEntity';
import { StockBranchEntity } from '../../../domain/stockBranch/StockBranchEntity';
import { StockStoreHouseEntity } from '../../../domain/storehouse/stockStoreHouseEntity';
import { Category } from '../../../domain/category/CategoryEntity';
import { SubCategoryUseCase } from '../../../application/subCategory/SubCategoryUseCase';
import { createSlug, generateUUID, RandomCodeId } from '../../../../shared/infrastructure/validation/Utils';
import mongoose, { AnyObject } from 'mongoose';
import sharp from 'sharp';
import { ObjectId } from 'mongodb';


export class ProductController extends ResponseData {
  protected path = "/product";
  private readonly onlineStoreHouse = "662fe69b9ba1d8b3cfcd3634"

  constructor(
    private productUseCase: ProductUseCase,
    private categoryUseCase: CategoryUseCase,
    private stockStoreHouseUseCase: StockStoreHouseUseCase,
    private readonly s3Service: S3Service,
    private subCategoryUseCase: SubCategoryUseCase,
  ) {
    super();
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.searchProduct = this.searchProduct.bind(this);
    this.getNoStockProducts = this.getNoStockProducts.bind(this);
    this.getProductsByCategory = this.getProductsByCategory.bind(this);
    this.getProductsByCategories = this.getProductsByCategories.bind(this);
    this.getProductsBySubCategory = this.getProductsBySubCategory.bind(this);
    this.getVideos = this.getVideos.bind(this);
    this.updateProductVideo = this.updateProductVideo.bind(this);
    this.updateThumbnail = this.updateThumbnail.bind(this);
    this.addOneImageProduct = this.addOneImageProduct.bind(this)
    this.deleteOneImageDetail = this.deleteOneImageDetail.bind(this);
    this.getSimilarProducts = this.getSimilarProducts.bind(this);
    this.updateURLS = this.updateURLS.bind(this);    
    this.deleteVideoDetail = this.deleteVideoDetail.bind(this);
    this.addOneVideoProduct = this.addOneVideoProduct.bind(this);

  }

  public async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productUseCase.getProducts();
      this.invoke(response, 200, res, "", next);
      // if (!(response instanceof ErrorHandler)) {
      //   const updatedResponse = await Promise.all(
      //     response.map(async (item: any) => {
      //       const images = item.images;
      //       const updatedImages = await Promise.all(
      //         images.map(async (image: any) => {
      //           const url = await this.s3Service.getUrlObject(
      //             image + ".jpg"
      //           );
      //           return url;
      //         })
      //       );
      //       const video = item.video
      //       const video_url = await this.s3Service.getUrlObject(
      //         video + ".mp4"
      //       )
      //       const thumbnail = item.thumbnail
      //       if (typeof thumbnail === 'string' && thumbnail.startsWith("https://")) {
      //         item.thumbnail = thumbnail;
      //       }
      //       if (thumbnail) {
      //         item.thumbnail = await this.s3Service.getUrlObject(
      //           (thumbnail) + ".jpg"
      //         );
      //       }

      //       item.images = updatedImages;
      //       item.video = video_url
      //       return item;
      //     })
      //   );

      //   this.invoke(updatedResponse, 200, res, "", next);
      // }
    } catch (error) {
      console.log(error);
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }


  public async getProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const responseStock = await this.stockStoreHouseUseCase.getProductStock(id, this.onlineStoreHouse)
      const responseProduct: any | null = await this.productUseCase.getProduct(id);
      const parsed = responseProduct.toJSON();
      let response = null;
      if (responseStock && responseStock.stock) {
        response = {
          ...parsed,
          stock: responseStock.stock
        }
      } else {
        response = responseProduct
      }     
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }


  async getNoStockProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productUseCase.getProducts(); // Asegúrate de definir el tipo correcto para getProducts()
      const stock: StockStoreHouseEntity[] = await this.stockStoreHouseUseCase.getStockNoDetail('662fe69b9ba1d8b3cfcd3634'); // Asegúrate de definir el tipo correcto para getStockNoDetail()

      // Obtener los IDs de productos y stock
      const productIds = new Set(products?.map((product: any) => product._id.toString()));
      const stockProductIds = new Set(stock.map((item) => item.product_id.toString()));

      // Filtrar productos que no tienen stock asociado
      const productsNotInStock = products.filter((product: any) => !stockProductIds.has(product._id.toString()));

      // Filtrar elementos de stock que no están asociados a productos
      const stockNotInProducts = stock.filter((item) => !productIds.has(item.product_id.toString()));

      // Combinar ambos resultados
      const uniqueElements = [...productsNotInStock, ...stockNotInProducts];


      this.invoke(uniqueElements, 200, res, "", next);
    } catch (error) {

      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }





  public async createProduct(req: Request, res: Response, next: NextFunction) {
    const data = { ...req.body };

    try {
      const slug = createSlug(data.name);
      const sku = RandomCodeId('PR');
      let response2: any = [];

      let response: any = await this.productUseCase.createProduct({ ...data, slug, sku });

      if (!(response instanceof ErrorHandler)) {
        const urls: { url: string }[] = [];
        const video_urls: { url: string; type: string }[] = [];
        let thumbnail_url = '';

        if (req.files && Array.isArray(req.files)) {
          await Promise.all(
            req.files.map(async (item: any, index: number) => {
              if (item.fieldname === 'images') {
                const pathObject = `${this.path}/${response._id}/images/${index}`;
                const { url } = await this.s3Service.uploadToS3AndGetUrl(pathObject, item, 'image/webp');
                urls.push({ url: url.split("?")[0] });
              }

              if (item.fieldname === 'thumbnail') {
                const pathThumbnail = `${this.path}/thumbnail/${response._id}`;
                const { url } = await this.s3Service.uploadToS3AndGetUrl(pathThumbnail, item, 'image/webp');
                thumbnail_url = url.split("?")[0];
              }

              const match = item.fieldname.match(/videos\[(\d+)\]\[file\]/);
              if (match) {
                const index = parseInt(match[1], 10);
                const videoType = req.body.videos?.[index]?.type || 'unknown';
                const pathVideo = `${this.path}/${response._id}/videos/${index}`;

                const { url } = await this.s3Service.uploadToS3AndGetUrl(`${pathVideo}.mp4`, item, "video/mp4");
                video_urls.push({ url: url.split("?")[0], type: videoType });
              }
            })
          );

          // Actualizar producto con las nuevas URLs.
          response = await this.productUseCase.updateProduct(response._id, {
            images: urls,
            videos: video_urls,
            thumbnail: thumbnail_url,
          });

          response.images = urls;
          response.videos = video_urls;
          response.thumbnail = thumbnail_url;
        }

        response2 = response;
      } else {
        response2 = response;
      }

      this.invoke(response2, 201, res, 'Producto creado con éxito', next);
    } catch (error: any) {
      console.error(error);

      if (error?.code === 11000) {
        const duplicatedField = Object.keys(error.keyPattern)[0];
        const duplicatedValue = error.keyValue[duplicatedField];
        return res.status(400).json({
          error: `El campo ${duplicatedField} con valor '${duplicatedValue}' ya está en uso.`,
        });
      } else {
        next(new ErrorHandler(error, 500));
      }
    }
  }


  public async updateProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { values } = req.body
    try {
      const response = await this.productUseCase.updateProduct(id, { ...values });

      this.invoke(response, 201, res, 'Se actualizó con éxito', next);

    } catch (error) {
      next(new ErrorHandler('Hubo un error al actualizar', 500));
    }
  }

  public async updateProductVideo(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      let response: any;
      let video_paths: string[] = [];
      let video_urls: string[] = [];

      if (Array.isArray(req.files) && req.files.length > 0) {
        await Promise.all(
          req.files.map(async (item: any, index: number) => {
            const pathVideo = `${this.path}/${id}/${index}`;
            const { url } = await this.s3Service.uploadToS3AndGetUrl(
              pathVideo + ".mp4",
              item,
              "video/mp4"
            );
            video_paths.push(pathVideo);
            video_urls.push(url.split("?")[0] ?? "");
          }
          )
        );
      }

      response = await this.productUseCase.updateProduct(id, { videos: video_urls });
      response.videos = video_urls

      this.invoke(response, 201, res, 'Se actualizó con éxito', next);

    } catch (error) {
      next(new ErrorHandler('Hubo un error al actualizar', 500));
    }
  }

  public async updateThumbnail(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      let response: any
      let thumbnail_path: string;
      let thumbnail_url: string;
      response = await this.productUseCase.getProduct(id)
      const pathThumbnail = `${this.path}/thumbnail/${response?._id}`;
      const { url } = await this.s3Service.uploadToS3AndGetUrl(
        pathThumbnail,
        req.file,
        'image/webp'
      );
      thumbnail_path = pathThumbnail
      thumbnail_url = url.split("?")[0] ?? "";
      response = await this.productUseCase.updateProduct(id, { thumbnail: thumbnail_url })
      response.thumbnail = thumbnail_url
      this.invoke(response, 201, res, 'Se actualizó con éxito', next);
    } catch (error) {
      next(new ErrorHandler('Hubo un error al actualizar', 500));
    }
  }

  public async addOneImageProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      let response: any;

      response = await this.productUseCase.getProduct(id)
      if (req.file) {
        const imageId = generateUUID()
        const pathObject = `${this.path}/${response?._id}/${imageId}`;
        const { url } = await this.s3Service.uploadToS3AndGetUrl(
          pathObject,
          req.file,
          'image/webp'
        )
        const updatedImages = [...response.images, { url: url.split("?")[0] }];
        await this.productUseCase.updateProduct(id, { images: updatedImages });
      }
      response = await this.productUseCase.getProduct(id)
      // const updatedImages = await Promise.all(
      //   response.images.map(async (image: any) => {
      //     const url = await this.s3Service.getUrlObject(image.url + ".jpg");
      //     return { url: url, _id: image._id };
      //   })
      // );
      // response.images = updatedImages;
      this.invoke(response, 201, res, 'Se actualizó con éxito', next);
    } catch (error) {
      console.log(error);
      next(new ErrorHandler('Hubo un error al actualizar', 500));
    }
  }

  public async addOneVideoProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { type } = req.body;

    try {
      const response: any = await this.productUseCase.getProduct(id);

      if (!Array.isArray(req.files) || req.files.length === 0) {
        return next(new ErrorHandler('No se subieron videos', 400)); // Error 400 para peticiones incorrectas
      }

      const newVideos = await Promise.all(
        req.files.map(async (item: any) => {
          const pathVideo = `${this.path}/${id}/${type}`;
          const { url } = await this.s3Service.uploadToS3AndGetUrl(
            pathVideo + ".mp4",
            item,
            "video/mp4"
          );
           const url1 =  url.split("?")[0] 
          return { url : url1, type };
        })
      );

      // Combinar correctamente los videos existentes con los nuevos
      const updatedVideos = [...(response.videos || []), ...newVideos];

      const updatedResponse = await this.productUseCase.updateProduct(id, { videos: updatedVideos });

      this.invoke(updatedResponse, 201, res, 'Se actualizó con éxito', next);
    } catch (error) {
      
      console.error('Error updating video product:', error); // Mensaje de error más descriptivo para logging
      next(new ErrorHandler('Hubo un error al actualizar', 500));
    }
  }



  public async deleteOneImageDetail(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params; // ID del producto
    const { imageId } = req.body; // ID de la imagen a elimina

    try {
      // Obtiene el producto por su ID
      const product: any = await this.productUseCase.getProduct(id);

      if (!product) {
        return next(new ErrorHandler('Producto no encontrado', 404));
      }
      const updated: any = await this.productUseCase.deleteImageProduct(id, imageId)
      // const updatedImagesWithUrls = await Promise.all(
      //   updated.images.map(async (image: any) => {
      //     const url = await this.s3Service.getUrlObject(image.url + ".jpg");
      //     return { _id: image._id, url: url };
      //   })
      // );
      // // Actualiza el campo images con las URLs obtenidas
      // updated.images = updatedImagesWithUrls;

      // Respuesta exitosa
      this.invoke(updated, 201, res, 'Se actualizó con éxito', next);
    } catch (error) {
      console.error(error);
      next(new ErrorHandler('Hubo un error al actualizar', 500));
    }
  }

  public async deleteVideoDetail(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params; // ID del producto
    const { video_id } = req.body; // ID de la imagen a elimina

    try {
      // Obtiene el producto por su ID
      const product: any = await this.productUseCase.getProduct(id);

      if (!product) {
        return next(new ErrorHandler('Producto no encontrado', 404));
      }
      const updated: any = await this.productUseCase.deleteVideoProduct(id, video_id)

      this.invoke(updated, 201, res, 'Se actualizó con éxito', next);
    } catch (error) {
      console.error(error);
      next(new ErrorHandler('Hubo un error al actualizar', 500));
    }
  }





  public async deleteProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const available = await this.stockStoreHouseUseCase.getProductStock(id, '662fe69b9ba1d8b3cfcd3634')
      if (available?.stock > 0) {
        return next(new ErrorHandler("No se puede eliminar hay existencias de este producto", 500));
      } else {
        const response = await this.productUseCase.deleteProduct(id);
        this.invoke(response, 201, res, "Eliminado con exito", next);
      }
    } catch (error) {
      next(new ErrorHandler("Hubo un error eliminar", 500));
    }
  }
  public async searchProduct(req: Request, res: Response, next: NextFunction) {
    const { search } = req.body
    try {
      if (!search) return next(new ErrorHandler("ingresa una busqueda", 404));
      const page = Number(req.query.page) || 1;
      const response: any | null = await this.productUseCase.searchProducts(search, page);            
      // Preparar la respuesta final
      this.invoke({
        products: response.products,
        total: response.total
      }, 200, res, "", next);
    } catch (error) {
      console.log("search product error", error);
      next(new ErrorHandler("Hubo un error al buscar", 500));
    }

  }

  public async getProductsByCategory(req: Request, res: Response, next: NextFunction) {
    const { category } = req.body;
    const queryparams = req.query;
    try {
      if (!category) return next(new ErrorHandler("El nombre de la categoria es requerida", 404));

      const categoria: any | null = await this.categoryUseCase.getDetailCategoryByName(category);
      if (categoria == null) return next(new ErrorHandler("La categoria no existe", 404));
      
      const products: any | null = await this.productUseCase.getProductsByCategory(categoria._id, this.onlineStoreHouse, queryparams);         
      
      const response = {
        category: categoria,
        products: products.products,
        total: products.total
      };

      this.invoke(response, 201, res, '', next);


    } catch (error) {
      // console.log();      
      next(new ErrorHandler("Hubo un error al buscar", 500));
      console.log("category product error", error);
    }
  }

  public async getProductsBySubCategory(req: Request, res: Response, next: NextFunction) {
    const { subcategory } = req.body
    const queryparams = req.query;

    try {
      if (!subcategory) return next(new ErrorHandler("El nombre de la subcategoria es requerida", 404));

      const subcategoria: any | null = await this.subCategoryUseCase.getDetailSubCategoryByName(subcategory);
      if (subcategoria == null) return next(new ErrorHandler("La subcategoria no existe", 404));
      
      const products: any | null = await this.productUseCase.getProductsBySubCategory(subcategoria._id, this.onlineStoreHouse, queryparams);               

      const response = {
        subcategory: subcategoria,
        products: products.products,
        total: products.total
      };
      
      this.invoke(response, 201, res, '', next);      
    } catch (error) {
      next(new ErrorHandler("Hubo un error al buscar", 500));
      console.log("subcategory product error", error);
    }
  }

  public async getProductsByCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = ["Hogar, Muebles y jardín", "Belleza y Cuidado Personal"];
      // const categories = ["Nueva categoria"];
      const response: any | null = await this.categoryUseCase.getCategoriesAndProducts(categories, this.onlineStoreHouse);            
      // Llamada de invocación con la respuesta
      this.invoke(response, 201, res, '', next);            
    } catch (error) {
      console.log(error, 'ok');
      next(new ErrorHandler("Hubo un error al obtener la información", 500));
    }
  }


  public async getVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const response: any | null = await this.productUseCase.getVideoProducts();    
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      console.log(error);
      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }


  public async getSimilarProducts(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params //product id
    try {
      const productDetail: any | null = await this.productUseCase.getProduct(id);
      const category = productDetail?.category._id;      
      if (productDetail == null) return next(new ErrorHandler("Este producto no existe", 404));      
      let response: any | null = await this.productUseCase.getRandomProductsByCategory(category, productDetail._id, this.onlineStoreHouse);      
      this.invoke(response, 200, res, "", next);      
    } catch (error) {
      console.log(error, 'ok');
      next(new ErrorHandler("Hubo un error al obtener la información", 500));
    }
  }




  

  public async updateURLS(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productUseCase.getProducts();
  
      if (!(response instanceof ErrorHandler)) {
        await Promise.all(
          response.map(async (item: any) => {
            // Update image URLs
            item.images = item.images?.map((image: any) => {
              if (typeof image === "string" && !image?.startsWith("https://")) {
                return {
                  _id: new ObjectId(),
                  url: `https://cichmex.s3.us-east-2.amazonaws.com/production${image}.jpg`,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };
              } else if (image?.url && !image.url.startsWith("https://")) {
                image.url = `https://cichmex.s3.us-east-2.amazonaws.com/production${image.url}.jpg`;
                image.updatedAt = new Date(); // Update timestamp
              }
              return image;
            }) || [];
  
            // Update video URLs
            // item.videos = item.videos?.map((video: any) => {          
            //   if(typeof video === "string" && !video?.startsWith("https://")) {
            //     video = `https://cichmex.s3.us-east-2.amazonaws.com/production${video}.mp4`
            //   }    
            //   if (video && !video.url?.startsWith("https://")) {
            //     video.url = `https://cichmex.s3.us-east-2.amazonaws.com/production${video.url}.mp4`;
            //   }
            //   return video;
            // }) || [];
  
            // Update thumbnail URL
            if (item.thumbnail && !item.thumbnail?.startsWith("https://")) {
              item.thumbnail = `https://cichmex.s3.us-east-2.amazonaws.com/production${item.thumbnail}.jpg`;
            }
  
            // Update product in the database
            await this.productUseCase.updateProduct(item._id, {
              images: item.images,
              videos: item.videos,
              thumbnail: item.thumbnail,
            });
          })
        );
      }
  
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      console.log("Error:", error);
      next(new ErrorHandler("Hubo un error al actualizar la información", 500));
    }
  }

  
  public async getProductVariantDetail(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body // id de la variante 
    try{
      const response = {}
      this.invoke(response, 200, res, "", next);
    }catch(error){  
      next(new ErrorHandler("Hubo un error al obtener la información", 500));
    }
  }
  public async deleteProductVariant(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body // id de la variante
    try{
      const response = {}
      this.invoke(response, 200, res, "", next);
    }catch(error){  
      next(new ErrorHandler("Hubo un error al elimianr la variante", 500));
    }
  }
  public async updateProductVariant(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body // id de la variante
    try{
      const response = {}
      this.invoke(response, 200, res, "", next);
    }catch(error){  
      next(new ErrorHandler("Hubo un error al actualizar la variante", 500));
    }
  }
  
  


}


