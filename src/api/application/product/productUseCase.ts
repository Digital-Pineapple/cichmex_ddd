import { ObjectId } from "mongoose";
import { ErrorHandler } from "../../../shared/domain/ErrorHandler";
import { PopulateGuide, PopulateProductCategory, PopulateProductSubCategory } from "../../../shared/domain/PopulateInterfaces";
import { ProductEntity } from "../../domain/product/ProductEntity";
import { ProductRepository } from "../../domain/product/ProductRepository";
import { retrieveAWSFiles, retrieveParsedImageProducts } from "../../../helpers/retrieveImages";


export class ProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  public async getProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.findAll(PopulateProductCategory, PopulateProductSubCategory);
  }
  public async getSimpleProducts(): Promise<ProductEntity[] | null> {
    return await this.productRepository.AllProducts()
  }


  public async getProduct(
    _id: string
  ): Promise<ProductEntity | ErrorHandler| null > {
    const response =  await this.productRepository.findDetailProductById(_id, PopulateProductCategory, PopulateProductSubCategory, PopulateGuide)
    return response
  }
  public async deleteImageProduct(
    _id: string,
    imageId: any
  ): Promise<ProductEntity | ErrorHandler| null > {
    return  await this.productRepository.startDeleteImageDetail(_id,imageId) 
  }
  public async deleteVideoProduct(
    _id: string,
    video_id: any
  ): Promise<ProductEntity | ErrorHandler| null > {
    return  await this.productRepository.startDeleteVideoDetail(_id,video_id) 
  }

  public async createProduct(body:any): Promise<ProductEntity | ErrorHandler | null> {
    const product = await this.productRepository.findOneItem({ name:body.name, status:true });
    if (product) return new ErrorHandler(`Producto con nombre ${product.name} ya esta en uso `, 400);
    return await this.productRepository.createOne({...body});
  }

  public async updateProduct(
    _id: string,
    updated: any
  ): Promise<ProductEntity | ErrorHandler> {
    // const product = await this.productRepository.findOneItem({name: updated.name, status: true})
    // if (product) return new ErrorHandler(`Producto con nombre ${product.name} ya esta en uso `, 400);
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
    return  await this.productRepository.findAllItems({category: category, status: true})
  }
  public async subCategoryProducts(subCategory: any): Promise<ProductEntity[] | null> {
    return  await this.productRepository.findAllItems({subCategory: subCategory, status: true})
  }
  public async getVideoProducts(page: number): Promise<ProductEntity[] | ErrorHandler |  null> {
    const res : any | null = await this.productRepository.findVideoProducts(page);
    res.products = retrieveParsedImageProducts(res.products)
    return res;  
  }
  public async getRandomProductsByCategory(id: any, skiproduct: any, storehouse: any ): Promise<ProductEntity[] | ErrorHandler |  null> {
    let products : any | null  = await this.productRepository.findRandomProductsByCategory(id, skiproduct, storehouse)    
    products =  retrieveParsedImageProducts(products)
    return products;  

  }
  public async searchProducts(search: string, page: number): Promise<ProductEntity[] | ErrorHandler | null> {
    let res: any | null = await this.productRepository.findSearchProducts(search, page);    
    res.products = retrieveParsedImageProducts(res.products);
    return res;
  }

  public async getProductsByCategory(categoryId: ObjectId, storehouse: string, queryparams: Object): Promise<ProductEntity[] | ErrorHandler | null> {
    const response : any | null = await this.productRepository.findProductsByCategory(categoryId, storehouse, queryparams);
    // console.log(response, "por categoria");    
    response.products = retrieveParsedImageProducts(response.products)
    return response
  }
  public async getProductsBySubCategory(subcategoryId: ObjectId, storehouse: string, queryparams: Object): Promise<ProductEntity[] | ErrorHandler | null> {
    const response: any | null = await this.productRepository.findProductsBySubCategory(subcategoryId, storehouse, queryparams)
    response.products = retrieveParsedImageProducts(response.products)
    return response
  }
  public async getRecentAddedProducts():  Promise<ProductEntity[] | ErrorHandler | null> {
     let response: any | null = await this.productRepository.findRecentAddedProducts();
     response = retrieveParsedImageProducts(response)
     return response;
  }
  public async findProductsPaginate(skip: number, limit:number): Promise<ProductEntity[] | ErrorHandler | null> {
    return this.productRepository.GetProductPaginate(skip, limit)
  }

  public async countProducts (): Promise <any>{
    return this.productRepository.countProducts()
  }
  

}
