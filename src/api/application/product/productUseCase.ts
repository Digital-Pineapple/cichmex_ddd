import { ObjectId } from "mongoose";
import { ErrorHandler } from "../../../shared/domain/ErrorHandler";
import { PopulateProductCategory, PopulateProductSubCategory } from "../../../shared/domain/PopulateInterfaces";
import { ProductEntity } from "../../domain/product/ProductEntity";
import { ProductRepository } from "../../domain/product/ProductRepository";


export class ProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  public async getProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.findAll(PopulateProductCategory, PopulateProductSubCategory);
  }

  public async getProduct(
    _id: string
  ): Promise<ProductEntity | ErrorHandler| null > {
    const response =  await this.productRepository.findDetailProductById(_id, PopulateProductCategory, PopulateProductSubCategory)
    return response
  }
  public async deleteImageProduct(
    _id: string,
    imageId: any
  ): Promise<ProductEntity | ErrorHandler| null > {
    return  await this.productRepository.startDeleteImageDetail(_id,imageId) 
  }

  public async createProduct(body:any): Promise<ProductEntity | ErrorHandler | null> {
    const product = await this.productRepository.findOneItem({ name:body.name, status:true });
    if (product) return new ErrorHandler("Producto ya registrado", 400);
    return await this.productRepository.createOne({...body});
  }

  public async updateProduct(
    _id: string,
    updated: any
  ): Promise<ProductEntity> {
    
    return await this.productRepository.updateOne(_id, {...updated});
  }
  
  public async deleteProduct(_id: string): Promise<ProductEntity | null> {
    return this.productRepository.updateOne(_id, { status: false });
  }

  public async searchProduct(search: any): Promise<ProductEntity[] | null> {
    return this.productRepository.search(search)
  }
  public async searchProductsByCategory(category: any): Promise<ProductEntity[] | null> {
     return this.productRepository.findAllItems({category}, PopulateProductCategory, PopulateProductSubCategory)
  }
  public async categoryProducts(category: any): Promise<ProductEntity[] | null> {
    return this.productRepository.search(category)
  }
  public async getVideoProducts(): Promise<ProductEntity[] | ErrorHandler |  null> {
    return this.productRepository.findVideoProducts()
  }
  public async getRandomProductsByCategory(id: any, skiproduct: any, storehouse: any ): Promise<ProductEntity[] | ErrorHandler |  null> {
    return this.productRepository.findRandomProductsByCategory(id, skiproduct, storehouse)
  }
  public async searchProducts(search: string, page: number): Promise<ProductEntity[] | ErrorHandler | null> {
    return this.productRepository.findSearchProducts(search, page);
  }

  public async getProductsByCategory(categoryId: ObjectId, storehouse: string, page: number): Promise<ProductEntity[] | ErrorHandler | null> {
    return this.productRepository.findProductsByCategory(categoryId, storehouse, page)
  }
  public async getProductsBySubCategory(subcategoryId: ObjectId, storehouse: string, page: number): Promise<ProductEntity[] | ErrorHandler | null> {
    return this.productRepository.findProductsBySubCategory(subcategoryId, storehouse, page)
  }

}
