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
import { RandomCodeId } from '../../../../shared/infrastructure/validation/Utils';

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
  }

  public async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.productUseCase.getProducts();
      if (!(response instanceof ErrorHandler)) {
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
            const video = item.video
            const video_url = await this.s3Service.getUrlObject(
              video + ".mp4"
            )
            item.images = updatedImages;
            item.video = video_url
            return item;
          })
        );

        this.invoke(updatedResponse, 200, res, "", next);
      }

    } catch (error) {
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
      // console.log(response);      
      if (!(response instanceof ErrorHandler) && response !== null) {
        if (response.images) {
          const updatedImages = await Promise.all(
            response.images.map(async (image: any) => {
              const url = await this.s3Service.getUrlObject(image + ".jpg");
              return url;
            })
          );
          response.images = updatedImages;
        }
        if (response.video) {
          const video_url = await this.s3Service.getUrlObject(
            response.video + ".mp4"
          );
          response.video = video_url;
        }
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
      const productIds = new Set(products?.map((product) => product._id.toString()));
      const stockProductIds = new Set(stock.map((item) => item.product_id.toString()));

      // Filtrar productos que no tienen stock asociado
      const productsNotInStock = products.filter((product) => !stockProductIds.has(product._id.toString()));

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
    const { name, price, description, size, tag, category,
      subCategory, weight, brand, discountPrice,
      porcentDiscount,
      product_key,
      seoDescription,
      shortDescription,
      thumbnail,
      seoKeywords

    } = req.body;

    const createSlug = (slug: string): string => {
      let processedSlug = slug
        .replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ') // Caracteres especiales
        .toLowerCase() // Minúsculas
        .trim() // Espacios al principio y al final
        .replace(/\s+/g, '_'); // Reemplazo de espacios con guiones bajos

      return processedSlug;
    };
    try {
      const slug = createSlug(name);
      const sku = RandomCodeId('PR')

      let response2: any = []


      if (req.files && req.files.length > 0) {
        const paths: string[] = [];
        const urls: string[] = [];
        let video_paths: string[] = [];
        let video_urls: string[] = [];
        let thumbnail_path: string = '';
        let thumbnail_url: string = '';

        let response : any = await this.productUseCase.createProduct(
          {
            name,
            price,
            description,
            size,
            tag,
            slug,
            category,
            subCategory,
            weight,
            sku,
            brand,
            discountPrice,
            porcentDiscount,
            product_key,
            seoDescription,
            shortDescription,
            seoKeywords


          }



        );
        if (!(response instanceof ErrorHandler)) {

          await Promise.all(
            req.files.map(async (item: any, index: number) => {
              if (item.fieldname === 'images') {

                const pathObject = `${this.path}/${response?._id}/${index}`;
                const { url } = await this.s3Service.uploadToS3AndGetUrl(
                  pathObject + '.jpg',
                  item,
                  'image/jpg'
                );
                paths.push(pathObject);
                urls.push(url);
              }
              if (item.fieldname === 'thumbnail') {

                const pathThumbnail = `${this.path}/thumbnail/${response?._id}`;
                const { url } = await this.s3Service.uploadToS3AndGetUrl(
                  pathThumbnail + '.jpg',
                  item,
                  'image/jpg'
                );
                thumbnail_path = pathThumbnail
                thumbnail_url = url
              }
              if (item.fieldname === 'videos') {
                const pathVideo = `${this.path}/${response?._id}/${index}`;
                const { url } = await this.s3Service.uploadToS3AndGetUrl(
                  pathVideo + ".mp4",
                  item,
                  "video/mp4"
                );
                video_paths.push(pathVideo);
                video_urls.push(url);
              }
            })
          );
          response = await this.productUseCase.updateProduct(response?._id, {
            images: paths,
            videos: video_paths,
            thumbnail:thumbnail_path
          });
          response.images = urls;
          response.videos = video_urls
          response.thumbnail = thumbnail_url
          response2 = response
        }
        else {
          response2 = response
        }

      } else {

        let response = await this.productUseCase.createProduct(
          {
            name,
            price,
            description,
            size,
            tag,
            slug,
            category,
            subCategory,
            weight,
            sku,
            brand,
            discountPrice,
            porcentDiscount,
            product_key,
            seoDescription,
            shortDescription,
            seoKeywords
          }

        );
        response2 = response
      }

      this.invoke(response2, 201, res, 'Producto creado con éxito', next);

    } catch (error) {

      next(new ErrorHandler('Hubo un error al crear el producto', 500));
    }
  }


  public async updateProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, price, description, slug, size, category, subCategory, weight, images, video } = req.body;

    try {

      if (req.files && req.files.length > 0) {
        const paths: string[] = [];
        const urls: string[] = [];
        let video_path: string = '';
        let video_url: string = '';

        await Promise.all(
          req.files.map(async (item: any, index: number) => {
            if (item.fieldname === 'images') {

              const pathObject = `${this.path}/${id}/${index}`;
              const { url } = await this.s3Service.uploadToS3AndGetUrl(
                pathObject + '.jpg',
                item,
                'image/jpg'
              );
              paths.push(pathObject);
              urls.push(url);
            }
            if (item.fieldname === 'video') {
              const pathVideo = `${this.path}/${id}`;
              const { url } = await this.s3Service.uploadToS3AndGetUrl(
                pathVideo + ".mp4",
                item,
                "video/mp4"
              );
              video_path = pathVideo
              video_url = url
            }
          })
        );



        const response = await this.productUseCase.updateProduct(id, {
          slug,
          name,
          price,
          description,
          size,
          category,
          subCategory,
          images: paths,
          video: video_path,
          weight
        });
        response.images = urls,
          response.video = video_url
        this.invoke(response, 201, res, 'Se actualizó con éxito', next);
      } else {
        const response = await this.productUseCase.updateProduct(id, {
          name,
          price,
          description,
          slug,
          size,
          category,
          subCategory,
          weight
        });

        this.invoke(response, 201, res, 'Se actualizó con éxito', next);

      }
    } catch (error) {
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
      const response = await this.productUseCase.searchProduct(search)
      this.invoke(response, 201, res, 'Busqueda exitosa', next);
    } catch (error) {

      next(new ErrorHandler("Hubo un error al buscar", 500));
    }

  }
  public async getProductsByCategory(req: Request, res: Response, next: NextFunction) {
    const { category } = req.body
    try {
      const categoria: any | null = await this.categoryUseCase.getDetailCategoryByName(category);
      if (categoria == null) {
        return next(new ErrorHandler("La categoria no existe", 404));
      }
      const response: any | null = await this.categoryUseCase.getProductsByCategory(categoria._id, this.onlineStoreHouse);
      const resCategory = response[0]
      resCategory.category_image = await this.s3Service.getUrlObject(resCategory.category_image + ".jpg");
      await Promise.all(
        resCategory.products.map(async (product: any) => {
          const parsed = await Promise.all(
            product.images.map(async (image: any) => {
              image = await this.s3Service.getUrlObject(image + ".jpg");
              return image
            })
          )
          product.images = parsed;
        })
      )

      this.invoke(response, 201, res, '', next);
    } catch (error) {
      console.log(error);

      next(new ErrorHandler("Hubo un error al obtener la información", 500));
    }
  }
  public async getProductsBySubCategory(req: Request, res: Response, next: NextFunction) {
    const { subcategory } = req.body
    try {
      const subcat: any | null = await this.subCategoryUseCase.getDetailSubCategoryByName(subcategory);
      if (subcat == null) {
        return next(new ErrorHandler("La categoria no existe", 404));
      }
      const response: any | null = await this.subCategoryUseCase.getProductsBySubCategory(subcat._id, this.onlineStoreHouse);
      const resSubCategory = response[0]
      resSubCategory.subcategory_image = await this.s3Service.getUrlObject(resSubCategory.subcategory_image + ".jpg");
      await Promise.all(
        resSubCategory.products.map(async (product: any) => {
          const parsed = await Promise.all(
            product.images.map(async (image: any) => {
              image = await this.s3Service.getUrlObject(image + ".jpg");
              return image
            })
          )
          product.images = parsed;
        })
      )
      this.invoke(response, 201, res, '', next);
    } catch (error) {
      console.log(error);
      next(new ErrorHandler("Hubo un error al obtener la información", 500));
    }
  }

  public async getProductsByCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = ["Ropa, Bolsas y Calzado", "Hogar, Muebles y jardín", "Industrias y Oficinas"]
      const response: any | null = await this.categoryUseCase.getCategoriesAndProducts(categories, this.onlineStoreHouse);
      const updatedResponse = await Promise.all(response.map(async (category: any) => {
        await Promise.all(
          category.products.map(async (product: any) => {
            const parsedImages = await Promise.all(product.images.map(async (image: any) => {
              const url = await this.s3Service.getUrlObject(image + ".jpg");
              return url
            }));
            product.images = parsedImages;
            return product
          }))
        return category
      }));

      this.invoke(response, 201, res, '', next);

    } catch (error) {
      console.log(error);

      next(new ErrorHandler("Hubo un error al obtener la información", 500));
    }

  }
}
