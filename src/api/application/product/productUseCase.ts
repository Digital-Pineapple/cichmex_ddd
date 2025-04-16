import { ObjectId } from "mongoose";
import { ErrorHandler } from "../../../shared/domain/ErrorHandler";
import { PopulateGuide, PopulateProductCategory, PopulateProductSubCategory } from "../../../shared/domain/PopulateInterfaces";
import { ProductEntity } from "../../domain/product/ProductEntity";
import { ProductRepository } from "../../domain/product/ProductRepository";
import { retrieveAWSFiles, retrieveParsedImageProducts } from "../../../helpers/retrieveImages";


// Clase que contiene la lógica de negocio relacionada con los productos
export class ProductUseCase {
  // Constructor que recibe el repositorio de productos
  constructor(private readonly productRepository: ProductRepository) {}

  // Método para obtener todos los productos
  public async getProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.findAll(PopulateProductCategory, PopulateProductSubCategory);
  }
  // Método para obtener todos los productos de forma simple
  public async getSimpleProducts(): Promise<ProductEntity[] | null> {
    return await this.productRepository.AllProducts()
  }


  // Método para obtener un producto por su ID
  public async getProduct(
    _id: string
  ): Promise<ProductEntity | ErrorHandler| null > {
    const response =  await this.productRepository.findDetailProductById(_id, PopulateProductCategory, PopulateProductSubCategory, PopulateGuide)
    return response
  }
  // Método para eliminar una imagen de un producto
  public async deleteImageProduct(
    _id: string,
    imageId: any
  ): Promise<ProductEntity | ErrorHandler| null > {
    return  await this.productRepository.startDeleteImageDetail(_id,imageId) 
  }
  // Método para eliminar un video de un producto
  public async deleteVideoProduct(
    _id: string,
    video_id: any
  ): Promise<ProductEntity | ErrorHandler| null > {
    return  await this.productRepository.startDeleteVideoDetail(_id,video_id) 
  }

  // Método para crear un nuevo producto
  public async createProduct(body:any): Promise<ProductEntity | ErrorHandler | null> {
    const product = await this.productRepository.findOneItem({ name:body.name, status:true });
    if (product) return new ErrorHandler(`Producto con nombre ${product.name} ya esta en uso `, 400);
    return await this.productRepository.createOne({...body});
  }

  // Método para actualizar un producto
  public async updateProduct(
    _id: string,
    updated: any
  ): Promise<ProductEntity | ErrorHandler> {
    // const product = await this.productRepository.findOneItem({name: updated.name, status: true})
    // if (product) return new ErrorHandler(`Producto con nombre ${product.name} ya esta en uso `, 400);
    return await this.productRepository.updateOne(_id, {...updated});
  }
  
  // Método para eliminar un producto
  public async deleteProduct(_id: string): Promise<ProductEntity | null> {
    return this.productRepository.updateOne(_id, { status: false });
  }

  // Método para buscar productos
  public async searchProduct(search: any): Promise<ProductEntity[] | null> {
    return this.productRepository.search(search)
  }
  // Método para buscar productos por categoría
  public async searchProductsByCategory(category: any): Promise<ProductEntity[] | null> {
     return this.productRepository.findAllItems({category}, PopulateProductCategory, PopulateProductSubCategory)
  }
  // Método para obtener productos por categoría
  public async categoryProducts(category: any): Promise<ProductEntity[] | null> {
    return  await this.productRepository.findAllItems({category: category, status: true})
  }
  // Método para obtener productos por subcategoría
  public async subCategoryProducts(subCategory: any): Promise<ProductEntity[] | null> {
    return  await this.productRepository.findAllItems({subCategory: subCategory, status: true})
  }
  // Método para obtener productos con video
  public async getVideoProducts(page: number): Promise<ProductEntity[] | ErrorHandler |  null> {
    const res : any | null = await this.productRepository.findVideoProducts(page);
    // res.products = retrieveParsedImageProducts(res.products)
    return res;  
  }
  // Método para obtener productos aleatorios por categoría
  public async getRandomProductsByCategory(id: any, skiproduct: any, storehouse: any ): Promise<ProductEntity[] | ErrorHandler |  null> {
    let products : any | null  = await this.productRepository.findRandomProductsByCategory(id, skiproduct, storehouse)    
    products =  retrieveParsedImageProducts(products)
    return products;  

  }
  // Método para buscar productos por nombre
  public async searchProducts(search: string, page: number): Promise<ProductEntity[] | ErrorHandler | null> {
    let res: any | null = await this.productRepository.findSearchProducts(search, page);    
    res.products = retrieveParsedImageProducts(res.products);
    return res;
  }

  // Método para obtener productos por categoría con paginación
  public async getProductsByCategory(categoryId: ObjectId, storehouse: string, queryparams: Object): Promise<ProductEntity[] | ErrorHandler | null> {
    const response : any | null = await this.productRepository.findProductsByCategory(categoryId, storehouse, queryparams);
    // console.log(response, "por categoria");    
    response.products = retrieveParsedImageProducts(response.products)
    return response
  }
  // Método para obtener productos por subcategoría con paginación
  public async getProductsBySubCategory(subcategoryId: ObjectId, storehouse: string, queryparams: Object): Promise<ProductEntity[] | ErrorHandler | null> {
    const response: any | null = await this.productRepository.findProductsBySubCategory(subcategoryId, storehouse, queryparams)
    response.products = retrieveParsedImageProducts(response.products)
    return response
  }
  // Método para obtener productos recientemente añadidos
  public async getRecentAddedProducts():  Promise<ProductEntity[] | ErrorHandler | null> {
     let response: any | null = await this.productRepository.findRecentAddedProducts();
     response = retrieveParsedImageProducts(response)
     return response;
  }
  // Método para obtener productos con paginación
  public async findProductsPaginate(skip: number, limit:number): Promise<ProductEntity[] | ErrorHandler | null> {
    return this.productRepository.GetProductPaginate(skip, limit)
  }

  // Método para contar la cantidad de productos
  public async countProducts (): Promise <any>{
    return this.productRepository.countProducts()
  }
  

}
