import { CategoryUseCase } from './../../../application/category/CategoryUseCase';
import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from "../../../../shared/domain/ErrorHandler";
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ProductUseCase } from "../../../application/product/productUseCase";
import { S3Service } from "../../../../shared/infrastructure/aws/S3Service";
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import { StockStoreHouseEntity } from '../../../domain/storehouse/stockStoreHouseEntity';
import { SubCategoryUseCase } from '../../../application/subCategory/SubCategoryUseCase';
import { createSlug, generateUUID, RandomCodeId } from '../../../../shared/infrastructure/validation/Utils';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { VariantProductUseCase } from '../../../application/variantProduct/VariantProductUseCase';
import { StockSHinputUseCase } from '../../../application/storehouse/stockSHinputUseCase';
import { validate as isUUID } from 'uuid'
import { StockSHoutputUseCase } from '../../../application/storehouse/stockSHoutputUseCase';
import { PopulateVariantProduct } from '../../../../shared/domain/PopulateInterfaces';
export class ProductController extends ResponseData {
  protected path = "/product";
  private readonly onlineStoreHouse = "662fe69b9ba1d8b3cfcd3634"

  constructor(
    private productUseCase: ProductUseCase,
    private categoryUseCase: CategoryUseCase,
    private stockStoreHouseUseCase: StockStoreHouseUseCase,
    private stockSHinputUseCase: StockSHinputUseCase,
    private stockSHoutputUseCase : StockSHoutputUseCase,
    private readonly s3Service: S3Service,
    private subCategoryUseCase: SubCategoryUseCase,
    private variantProductUseCase: VariantProductUseCase,
  ) {
    super();
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getAllProductsPaginate = this.getAllProductsPaginate.bind(this);
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
    this.processFiles = this.processFiles.bind(this);
    this.AddProdcutWithVariants = this.AddProdcutWithVariants.bind(this);
    this.conditionProduct = this.conditionProduct.bind(this);
    this.SelectSizeGuide = this.SelectSizeGuide.bind(this);
    this.AddVariants = this.AddVariants.bind(this);
    this.addDescriptionAndVideo = this.addDescriptionAndVideo.bind(this);
    this.updateMainFeatures = this.updateMainFeatures.bind(this);
    this.UpdateVariants = this.UpdateVariants.bind(this)
    this.updatePositionImages = this.updatePositionImages.bind(this);
    this.AddVariantsClothesShoes = this.AddVariantsClothesShoes.bind(this);
    this.getRecentProducts = this.getRecentProducts.bind(this);
    this.getAllProductsByCategory = this.getAllProductsByCategory.bind(this)
    this.getAllProductsBySubCategory = this.getAllProductsBySubCategory.bind(this)
  }

  public async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Obtener todos los productos
      const response = await this.productUseCase.getProducts();
        await Promise.all(
          response.map(async (item: any) => {
            // Buscar variantes asociadas al producto
            const variants = await this.variantProductUseCase.findAllVarinatsByProduct(item._id);
            // Verificar si hay variantes válidas y actualizar el producto
            const hasVariants = Array.isArray(variants) && variants.length > 0;
            await this.productUseCase.updateProduct(item._id, { has_variants: hasVariants });
          })
        );
     
  
      // Enviar la respuesta
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      console.error(error);
      // Manejo de errores
      next(new ErrorHandler( "Hubo un error al consultar la información", 500));
    }
  }
  

  public async getAllProductsPaginate(req: Request, res: Response, next: NextFunction) {
    const page = parseInt(req.query.page as string, 10) || 1; // Página actual
    const limit = parseInt(req.query.limit as string, 10) || 20; // Tamaño de página
    const skip = (page - 1) * limit;

    // Obtener los productos con paginación y ordenados por `createdAt`
    try {
      const [products, totalProducts] = await Promise.all([
        this.productUseCase.findProductsPaginate(skip, limit),
        this.productUseCase.countProducts(), // Método que devuelve el total de productos
      ]);

      // Obtener todos los productos
      if (!(products instanceof ErrorHandler) && products !== null) {
        // Actualizar las variantes de cada producto en paralelo
        await Promise.all(
          products.map(async (item: any) => {
            // Buscar variantes asociadas al producto
            const variants: any = await this.variantProductUseCase.findAllVarinatsByProduct(item._id)
            
            const hasVariants = Array.isArray(variants) && variants.length > 0;
            await this.productUseCase.updateProduct(item._id, { has_variants: hasVariants });
          })
        );
      }

      // Enviar la respuesta
      const response = {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        pageSize: limit,
        products,
      };
      this.invoke(response, 200, res, "", next);
    } catch (error) {
      console.error(error);
      // Manejo de errores
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
      if (responseStock && responseProduct.stock) {
        response = {
          ...parsed,
          stock: responseStock.stock
        }
      } else {
        response = responseProduct
      }

      const variants: any = await this.variantProductUseCase.findAllVarinatsByProduct(id);
      // Espera a que todas las promesas se resuelvan
      const newVariants = await Promise.all(
        variants.map(async (variant: any) => {
          const stockVariant = await this.stockStoreHouseUseCase.getVariantStock(
            variant._id,
            this.onlineStoreHouse
          );
          
          return { ...variant._doc, stock: stockVariant.stock };
        })
      );
      let stock = 0
      if (Array.isArray(variants) && variants.length <= 0) {

        try {
          const stockProduct = await this.stockStoreHouseUseCase.getProductStock(id, this.onlineStoreHouse);
          console.log(stockProduct);
          

          // Verifica si stockProduct es válido
          if (stockProduct && typeof stockProduct.stock === 'number') {
            stock = stockProduct.stock;
          } else {
            stock = 0
          }
        } catch (error) {
          console.error('Error al obtener el stock del producto:', error);
          throw new ErrorHandler('Hubo un error al obtener el stock del producto', 500);
        }
      }
      const AllResponse = { ...response._doc, variants: newVariants, stock: stock }

      this.invoke(AllResponse, 200, res, "", next);
    } catch (error) {
      console.log(error);


      next(new ErrorHandler("Hubo un error al consultar la información", 500));
    }
  }


  async getNoStockProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productUseCase.getProducts(); // Asegúrate de definir el tipo correcto para getProducts()
      const stock: StockStoreHouseEntity[] = await this.stockStoreHouseUseCase.getStockNoDetail('662fe69b9ba1d8b3cfcd3634'); // Asegúrate de definir el tipo correcto para getStockNoDetail()

      // Obtener los IDs de productos y stock
      const productIds = new Set(products?.map((product: any) => product._id.toString()));
      const stockProductIds = new Set(stock.map((item: any) => item.product_id.toString()));

      // Filtrar productos que no tienen stock asociado
      const productsNotInStock = products.filter((product: any) => !stockProductIds.has(product._id.toString()));

      // Filtrar elementos de stock que no están asociados a productos
      const stockNotInProducts = stock.filter((item: any) => !productIds.has(item.product_id.toString()));

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
      // Generar slug y SKU
      const slug = createSlug(data.name);
      const sku = RandomCodeId('PR');

      // Crear el producto base
      let product: any = await this.productUseCase.createProduct({ ...data, slug, sku });
      if (product instanceof ErrorHandler) {
        return this.invoke(product, 400, res, 'Error al crear el producto', next);
      }

      // Procesar archivos por lotes si existen
      if (req.files && Array.isArray(req.files)) {
        const batchSize = 5; // Tamaño del lote (ajústalo según tus necesidades)
        const { images, videos, thumbnail } = await this.processFiles(req.files, product._id, req.body);

        // Actualizar producto con las URLs generadas
        product = await this.productUseCase.updateProduct(product._id, {
          images,
          videos,
          thumbnail,
        });

        Object.assign(product, { images, videos, thumbnail });
      }

      this.invoke(product, 201, res, 'Producto creado con éxito', next);
    } catch (error: any) {
      if (error?.code === 11000) {
        const duplicatedField = Object.keys(error.keyPattern)[0];
        const duplicatedValue = error.keyValue[duplicatedField];
        return res.status(400).json({
          error: `El campo ${duplicatedField} con valor '${duplicatedValue}' ya está en uso.`,
        });
      }

      next(new ErrorHandler(error, 500));
    }
  }

  /**
   * Procesa los archivos subidos al servidor.
   */
  public async processFiles(files: any[], productId: string, body: any) {
    // Predefinir arreglo de imágenes con una longitud inicial adecuada
    const images: { url: string }[] = Array(files.filter(file => file.fieldname === 'images').length);
    const videos: { url: string; type: string }[] = [];
    let thumbnail = '';

    await Promise.all(
      files.map(async (file: any, index: number) => {
        if (file.fieldname === 'images') {
          // Usar el índice para colocar las imágenes en orden
          const imageIndex = index;
          const path = `${this.path}/${productId}/images/${imageIndex}`;
          const { url } = await this.s3Service.uploadToS3AndGetUrl(path, file, 'image/webp');
          images[imageIndex] = { url: url.split('?')[0] }; // Asignar en el índice correcto
        } else if (file.fieldname === 'thumbnail') {
          const path = `${this.path}/thumbnail/${productId}`;
          const { url } = await this.s3Service.uploadToS3AndGetUrl(path, file, 'image/webp');
          thumbnail = url.split('?')[0];
        } else if (file.fieldname.startsWith('videos')) {
          const match = file.fieldname.match(/videos\[(\d+)\]\[file\]/);
          if (match) {
            const videoIndex = parseInt(match[1], 10);
            const videoType = body.videos?.[videoIndex]?.type || 'unknown';
            const path = `${this.path}/${productId}/videos/${videoIndex}.mp4`;
            const { url } = await this.s3Service.uploadToS3AndGetUrl(path, file, 'video/mp4');
            videos[videoIndex] = { url: url.split('?')[0], type: videoType }; // Asignar en el índice correcto
          }
        }
      })
    );

    // Filtrar imágenes para eliminar posiciones vacías
    return {
      images: images.filter(Boolean),
      videos: videos.filter(Boolean),
      thumbnail
    };
  }


  public async updateProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { values } = req.body
    try {
      await this.productUseCase.updateProduct(id, { ...values });
      const product = await this.productUseCase.getProduct(id)

      this.invoke(product, 201, res, 'Se actualizó con éxito', next);

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
      const newResponse = await this.productUseCase.getProduct(id)

      this.invoke(newResponse, 201, res, 'Se actualizó con éxito', next);

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
          const url1 = url.split("?")[0]
          return { url: url1, type };
        })
      );

      // Combinar correctamente los videos existentes con los nuevos
      const updatedVideos = [...(response.videos || []), ...newVideos];

      await this.productUseCase.updateProduct(id, { videos: updatedVideos });
      const newResponse = await this.productUseCase.getProduct(id)

      this.invoke(newResponse, 201, res, 'Se actualizó con éxito', next);
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
      const newResponse = await this.productUseCase.getProduct(updated._id)

      this.invoke(newResponse, 201, res, 'Se actualizó con éxito', next);
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
        await this.stockStoreHouseUseCase.deleteStock(available?._id)
        const response = await this.productUseCase.deleteProduct(id);
        this.invoke(response, 201, res, "Eliminado con exito", next);
      }
    } catch (error) {
      console.log(error);
      
      next(new ErrorHandler("Hubo un error eliminar", 500));
    }
  }
  public async searchProduct(req: Request, res: Response, next: NextFunction) {
    const { search } = req.body
    try {
      if (!search) return next(new ErrorHandler("ingresa una busqueda", 404));
      const page = Number(req.query.page) || 1;
      const response: any | null = await this.productUseCase.searchProducts(search, page);
      
      if (!(response instanceof ErrorHandler) && response !== null) {
        // Actualizar las variantes de cada producto en paralelo
        await Promise.all(
          response.products.map(async (item: any) => {
            // Buscar variantes asociadas al producto
            const variants: any = await this.variantProductUseCase.findAllVarinatsByProduct(item._id)
            
            const hasVariants = Array.isArray(variants) && variants.length > 0;
            await this.productUseCase.updateProduct(item._id, { has_variants: hasVariants });
          })
        );
      }
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
        ...products
      };
      this.invoke(response, 201, res, '', next);
    } catch (error) {
      // console.log();      
      next(new ErrorHandler("Hubo un error al buscar", 500));
      console.log("category product error", error);
    }
  }
  public async getAllProductsByCategory(req: Request, res: Response, next: NextFunction) {
    const { category_id } = req.query;

    try {
     
      const response: any | null = await this.productUseCase.categoryProducts(category_id)
      
      this.invoke(response, 201, res, '', next);
    } catch (error) {
      // console.log();      
      next(new ErrorHandler("Hubo un error al buscar", 500));
      console.log("category product error", error);
    }
  }
  public async getAllProductsBySubCategory(req: Request, res: Response, next: NextFunction) {
    const { subCategory_id } = req.query;

    try {
      const response: any | null = await this.productUseCase.subCategoryProducts(subCategory_id)
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
        ...products
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

  public async updatePositionImages(req: Request, res: Response, next: NextFunction) {
    const { images } = req.body; // Recibe el arreglo con el nuevo orden
    const { id } = req.params; // ID del producto



    try {
      // Obtener el producto actual
      const product: any | null = await this.productUseCase.getProduct(id);

      if (!product) {
        return next(new ErrorHandler("Producto no encontrado", 404));
      }

      // Adaptar el arreglo de imágenes al nuevo orden
      const reorderedImages = images.map((newImage: any) => {
        const existingImage = product.images.find((img: any) => img.id === newImage.id);
        if (existingImage) {
          return existingImage; // Conservar los datos existentes
        }
        throw new Error(`La imagen con ID ${newImage.id} no existe en el producto`);
      });

      // Actualizar el producto con el nuevo orden de imágenes
      product.images = reorderedImages;
      await this.productUseCase.updateProduct(id, { images: reorderedImages })

      // Responder con éxito
      this.invoke(product, 200, res, "Se guardo correctamente", next);
    } catch (error) {
      console.error(error);
      return next(new ErrorHandler("Hubo un error al reordenar las imágenes", 500));
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

  public async AddProdcutWithVariants(req: Request, res: Response, next: NextFunction) {
    const data = { ...req.body }

    try {
      const response = await this.productUseCase.createProduct({ ...data })
      this.invoke(response, 200, res, "Se agregó exitosamente", next);
    } catch (error) {
      console.log("Error:", error);
      next(new ErrorHandler("Hubo un error al actualizar la información", 500));
    }
  }


  public async conditionProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { condition } = req.body

    try {
      const response = await this.productUseCase.updateProduct(id, condition)
      this.invoke(response, 200, res, "Se actualizó exitosamente", next);
    } catch (error) {
      console.log("Error:", error);
      next(new ErrorHandler("Hubo un error al actualizar la información", 500));
    }
  }
  public async SelectSizeGuide(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { sizeGuide } = req.body
    try {
      const response = await this.productUseCase.updateProduct(id, { size_guide: sizeGuide })
      this.invoke(response, 200, res, "Se actualizó exitosamente", next);
    } catch (error) {
      console.log("Error:", error);
      next(new ErrorHandler("Hubo un error al actualizar la información", 500));
    }
  }
  public async AddVariants(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { variants } = req.body;
    const user = req.user
    const SH_id = '662fe69b9ba1d8b3cfcd3634'
    const UserInfo = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      type_user: user.type_user,
    };
    const deleteStockProduct = await this.stockStoreHouseUseCase.getProductStock(id, SH_id)
    if (deleteStockProduct && !(!!deleteStockProduct?.variant_id)) {
      await this.stockSHoutputUseCase.createOutput({
        folio: RandomCodeId('AV'),
        SHStock_id: deleteStockProduct._id,
        quantity: deleteStockProduct.stock,
        newQuantity: 0,
        responsible: UserInfo,
        product_detail: id,
        reason: 'Create variants'
      })
      await this.stockStoreHouseUseCase.deleteStock(deleteStockProduct._id)
    }

    try {
      // Validar y transformar las variantes
      const parsedVariants = variants.map((variant: any) => {
        return {
          ...variant,
          attributes: Object.entries(variant.attributes).reduce((acc, [key, value]) => {
            acc[key] = value === 'undefined' || value === 'null' ? null : value; // Convierte valores inválidos a null
            return acc;
          }, {} as Record<string, any>),
        };
      });

      // Organizar los archivos por variante y mantener el orden de las imágenes
      const filesByVariant: { [key: number]: Express.Multer.File[] } = {};
      if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach((file) => {
          const match = file.fieldname.match(/variants\[(\d+)\]\[images\]\[(\d+)\]/);
          if (match) {
            const [_, variantIndex, imageIndex] = match.map(Number); // Extraer índices como números
            filesByVariant[variantIndex] = filesByVariant[variantIndex] || [];
            filesByVariant[variantIndex][imageIndex] = file; // Mantener el orden
          }
        });
      }

      await Promise.all(
        parsedVariants.map(async (variant: any, variantIndex: number) => {
          const sku = generateUUID()
          const addVariant: any = await this.variantProductUseCase.CreateVariant({ ...variant, sku: sku, product_id: id });
          const folio = RandomCodeId('PR')
          const stock = JSON.parse(variant.stock)

          const createStock: any = await this.stockStoreHouseUseCase.createStock({
            StoreHouse_id: SH_id,
            product_id: id,
            variant_id: addVariant._id,
            stock: stock
          })
          await this.stockSHinputUseCase.createInput({
            folio: folio,
            SHStock_id: createStock._id,
            quantity: stock,
            newQuantity: variant.stock,
            responsible: user,
            product_detail: id,
          })

          // Si hay imágenes para esta variante
          if (filesByVariant[variantIndex]) {
            const files = filesByVariant[variantIndex];

            // Procesar imágenes en orden
            const parsedImages = await Promise.all(
              files.map(async (file: Express.Multer.File) => {
                const pathObject = `${this.path}/${addVariant._id}/${file.originalname}`;
                const { url } = await this.s3Service.uploadToS3AndGetUrl(pathObject, file, 'image/webp');
                return { url: url.split("?")[0] }; // Guardar solo la URL sin parámetros
              })
            );

            // Actualizar la variante con las imágenes procesadas
            await this.variantProductUseCase.UpdateVariant(addVariant._id, { images: parsedImages });
          }

          return addVariant._id;
        })
      );
      const response = await this.productUseCase.getProduct(id);

      this.invoke(response, 200, res, "Variantes agregadas exitosamente", next);
    } catch (error) {
      console.error("Error al agregar variantes:", error);
      next(new ErrorHandler("Hubo un error al actualizar la información", 500));
    }
  }
  public async AddVariantsClothesShoes(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { variants } = req.body;
    const user = req.user;
    const SH_id = "662fe69b9ba1d8b3cfcd3634";
    const folio = RandomCodeId('PR')
    const UserInfo = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      type_user: user.type_user,
    };
    const objectProduct = new mongoose.Types.ObjectId(id)

    if (!variants || !Array.isArray(variants)) {
      return next(new ErrorHandler("Variantes no proporcionadas o inválidas", 400));
    }
    
    const deleteStockProduct = await this.stockStoreHouseUseCase.getProductStock(objectProduct, SH_id)
    
    
    if (deleteStockProduct && !(!!deleteStockProduct.variant_id)) {
      await this.stockSHoutputUseCase.createOutput({
        folio: RandomCodeId('AV'),
        SHStock_id: deleteStockProduct._id,
        quantity: deleteStockProduct.stock,
        newQuantity: 0,
        responsible: UserInfo,
        product_detail: id,
        reason: 'Create variants'
      })
      await this.stockStoreHouseUseCase.deleteStock(deleteStockProduct._id)
    }

    try {
      // Validar y transformar las variantes
      const parsedVariants = variants.map((variant: any) => ({
        ...variant,
        attributes: Object.entries(variant.attributes).reduce((acc, [key, value]) => {
          acc[key] = value === "undefined" || value === "null" ? null : value;
          return acc;
        }, {} as Record<string, any>),
      }));

      // Construir filesByVariant agrupado por color
      const filesByVariant: { [key: string]: Express.Multer.File[] } = {};
      
      if (req.files) {
        const files = req.files as Express.Multer.File[];

        let currentColor: string | null = null;
        let imageIndex = 0;

        files.forEach((file) => {
          const match = file.fieldname.match(/^(\d+)\[(.*?)\]$/);
          if (match) {
            const [_, index, color] = match;

            if (color !== currentColor) {
              currentColor = color;
              imageIndex = 0;
            }

            filesByVariant[color] = filesByVariant[color] || [];
            filesByVariant[color][imageIndex] = file;
            imageIndex++;
          }
        });
      }

      // Subir imágenes a S3 y construir imageUrlsByColor
      const imageUrlsByColor: { [color: string]: { url: string; color: string }[] } = {};

      await Promise.all(
        Object.entries(filesByVariant).map(async ([color, files]) => {
          imageUrlsByColor[color] = await Promise.all(
            files.map(async (file: Express.Multer.File, fileIndex: number) => {
              const uniqueFileName = `${Date.now()}-${color}-${fileIndex}`;
              const pathObject = `${this.path}/${uniqueFileName}.webp`;
              const { url } = await this.s3Service.uploadToS3AndGetUrl(pathObject, file, "image/*");
              return { url: url.split("?")[0], color: color };
            })
          );
        })
      );


      // Procesar las variantes y asignar las imágenes
      await Promise.all(
        parsedVariants.map(async (variant: any, variantIndex: number) => {
          try {
            const sku = generateUUID();
            const addVariant: any = await this.variantProductUseCase.CreateVariant({
              ...variant,
              sku,
              product_id: id,
            });

            const stock = variant.stock
            const SHStock = await this.stockStoreHouseUseCase.createStock({
              StoreHouse_id: SH_id,
              product_id: id,
              variant_id: addVariant._id,
              stock,
            });
            await this.stockSHinputUseCase.createInput({
              folio: folio,
              SHStock_id: SHStock?._id,
              quantity: stock,
              newQuantity: stock,
              responsible: UserInfo,
              product_detail: id
            })

            // Asignar imágenes a la variante por color
            const color: any = variant.attributes?.color;
            
            if (color && imageUrlsByColor[color]) {
              const images = imageUrlsByColor[color];
              await this.variantProductUseCase.UpdateVariant(addVariant._id, { images: images });
            }
          } catch (error) {
            console.error(`Error procesando variante ${variantIndex}:`, error);
          }
        })
      );

      const response: any = await this.productUseCase.getProduct(id)
      const variantsAll: any = await this.variantProductUseCase.findAllVarinatsByProduct(id);

      // Espera a que todas las promesas se resuelvan
      const newVariants = await Promise.all(
        variantsAll.map(async (variant: any) => {
          const stockVariant = await this.stockStoreHouseUseCase.getVariantStock(
            variant._id,
            this.onlineStoreHouse
          );
          return { ...variant._doc, stock: stockVariant.stock };
        })
      );
      const AllResponse = { ...response._doc, variants: newVariants }

      this.invoke(AllResponse, 200, res, "Variantes agregadas  exitosamente", next);
    } catch (error) {
      console.error("Error al agregar variantes:", error);
      next(new ErrorHandler("Hubo un error al actualizar la información", 500));
    }
  }



  public async addDescriptionAndVideo(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data = { ...req.body };
    let update: any = {};
    let videos: { url: string; type: string }[] = [];
  
    try {
      // Validar y procesar archivos de video si existen
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        videos = await Promise.all(
          req.files.map(async (video: Express.Multer.File) => {
            const type = video.fieldname.split("/")[1]; // Obtener el formato desde el MIME type
            const pathObject = `${this.path}/${id}/${video.originalname}`;

            const { url } = await this.s3Service.uploadToS3AndGetUrl(pathObject, video, 'video/mp4');

            return { url: url.split("?")[0], type }; // Guardar solo la URL sin parámetros
          })
        );
        update = await this.productUseCase.updateProduct(id, { ...data, videos });
      }
      update = await this.productUseCase.updateProduct(id, { ...data });

      // Responder al cliente
      this.invoke(update, 200, res, "Se actualizó exitosamente", next);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      next(new ErrorHandler("Hubo un error al actualizar la información", 500));
    }
  }


  public async updateMainFeatures(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { values } = req.body;

    try {
      await this.productUseCase.updateProduct(id, { ...values });
      const response = await this.productUseCase.getProduct(id);
      this.invoke(response, 200, res, "Se Actualizó con éxito", next);
    } catch (error: any) {
      // Manejo específico para errores de clave duplicada
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue).join(", ");
        const duplicateValue = Object.values(error.keyValue).join(", ");
        const message = `El campo único '${duplicateField}' ya está en uso con el valor '${duplicateValue}'. Por favor, usa otro valor.`;

        // Pasa un error personalizado al middleware de manejo de errores
        return next(new ErrorHandler(message, 409)); // 409 Conflict
      }

      // Manejo genérico de errores
      next(new ErrorHandler("Hubo un error al actualizar la información", 500));
    }
  }

  public async UpdateVariants(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { variants } = req.body;
    const user = req.user;
    const SH_id = "662fe69b9ba1d8b3cfcd3634";
    const objectProduct = new mongoose.Types.ObjectId(id)
    const UserInfo = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      type_user: user.type_user,
    };

    if (!id || !Array.isArray(variants)) {
      return next(new ErrorHandler("Datos inválidos para actualizar variantes", 400));
    }
    const deleteStockProduct = await this.stockStoreHouseUseCase.getProductStock(objectProduct, SH_id)
    
    
    if (deleteStockProduct && !(!!deleteStockProduct.variant_id)) {
      await this.stockSHoutputUseCase.createOutput({
        folio: RandomCodeId('AV'),
        SHStock_id: deleteStockProduct._id,
        quantity: deleteStockProduct.stock,
        newQuantity: 0,
        responsible: UserInfo,
        product_detail: id,
        reason: 'Create variants'
      })
      await this.stockStoreHouseUseCase.deleteStock(deleteStockProduct._id)
    }


    try {
      const parsedVariants = variants.map((variant: any) => {
        return {
          ...variant,
          attributes: Object.entries(variant.attributes).reduce((acc, [key, value]) => {
            acc[key] = value === 'undefined' || value === 'null' ? null : value; // Convierte valores inválidos a null
            return acc;
          }, {} as Record<string, any>),
        };
      });

      const filesByVariant: { [key: number]: Express.Multer.File[] } = {};

      // Procesar req.files
      if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach((file) => {
          const match = file.fieldname.match(/variants\[(\d+)\]\[images\]\[(\d+)\]/);
          if (match) {
            const [_, variantIndex] = match.map(Number);
            filesByVariant[variantIndex] = filesByVariant[variantIndex] || [];
            filesByVariant[variantIndex].push({ ...file });
          }
        });
      }



      await Promise.all(
        parsedVariants.map(async (variant: any, variantIndex: number) => {

          if (variant.images && variant._id) {

            const variantOld: any | null = await this.variantProductUseCase.findVariantById(variant._id)

            if (!variantOld) {
              return next(new ErrorHandler("Variante no encontrado", 404));
            }
            let reorderedImages = Array.isArray(variant.images) ? [...variant.images] : [];
            // Adaptar el arreglo de imágenes al nuevo orden
            reorderedImages = variant.images.map((newImage: any) => {
              const existingImage = variantOld.images.find((img: any) => img.url === newImage);
              if (existingImage) {
                return existingImage; // Conservar los datos existentes
              }
            });

            reorderedImages = reorderedImages.filter(Boolean);
            await this.variantProductUseCase.UpdateVariant(variant._id, { images: reorderedImages })
          }


          let addVariant: any;

          if (variant._id && mongoose.isValidObjectId(variant._id)) {
            if (variant.images) {
              delete variant.images
            }
            await this.variantProductUseCase.UpdateVariant(variant._id, { ...variant });
          } else {
            if (!variant._id || variant._id === 'undefined'|| isUUID(variant._id)) {
              delete variant._id;
            }

            const sku = generateUUID();
            addVariant = await this.variantProductUseCase.CreateVariant({
              ...variant,
              sku,
              product_id: id,
            });

            const folio = RandomCodeId('PR');
            const stock = JSON.parse(variant.stock);
            const createStock: any = await this.stockStoreHouseUseCase.createStock({
              StoreHouse_id: SH_id,
              product_id: id,
              variant_id: addVariant._id,
              stock,
            });

            await this.stockSHinputUseCase.createInput({
              folio,
              SHStock_id: createStock._id,
              quantity: stock,
              newQuantity: stock,
              responsible: user,
              product_detail: id,
            });
          }



          // Procesar imágenes
          if (filesByVariant[variantIndex]) {
            const files = filesByVariant[variantIndex];
            const variantOld: any = await this.variantProductUseCase.findVariantById(variant._id)

            let existingImages = Array.isArray(variantOld?.images) ? [...variantOld.images] : [];

            for (const file of files) {
              const match = file.fieldname.match(/variants\[(\d+)\]\[images\]\[(\d+)\]/);
              if (!match) continue;

              const position = parseInt(match[2], 10); // Obtener la posición específica

              const pathObject = `${this.path}/${variant._id || addVariant._id}/${file.originalname}`;
              const { url } = await this.s3Service.uploadToS3AndGetUrl(pathObject, file, 'image/webp');
              const imageUrl = url.split("?")[0];

              const newImage = {
                _id: new ObjectId(), // Generar un nuevo ID único
                url: imageUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              existingImages = [
                ...existingImages.slice(0, position), // Todas las imágenes antes de la posición
                newImage,                            // La nueva imagen a insertar
                ...existingImages.slice(position),   // Todas las imágenes después de la posición
              ];

            }

            existingImages = existingImages.filter(Boolean);

            await this.variantProductUseCase.UpdateVariant(
              variant._id || addVariant._id,
              { images: existingImages }
            );
          }
        })
      );

      const response: any = await this.productUseCase.getProduct(id)
      const variantsAll: any = await this.variantProductUseCase.findAllVarinatsByProduct(id);

      // Espera a que todas las promesas se resuelvan
      const newVariants = await Promise.all(
        variantsAll.map(async (variant: any) => {
          const stockVariant = await this.stockStoreHouseUseCase.getVariantStock(
            variant._id,
            this.onlineStoreHouse
          );
          
          return { ...variant._doc, stock: stockVariant.stock };
        })
      );
      const AllResponse = { ...response._doc, variants: newVariants }

      this.invoke(AllResponse, 200, res, "Variantes editadas exitosamente", next);
    } catch (error) {
      console.error("Error al agregar variantes:", error);
      next(new ErrorHandler("Hubo un error al actualizar la información", 500));
    }
  }

  public async getRecentProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productUseCase.getRecentAddedProducts();       
      this.invoke(response, 200, res, "", next);
      // console.log("newly added");            
    } catch (error) {
      console.log(error);         
      next(new ErrorHandler("Hubo un error al obtener la información", 500));
    }
  }










}


