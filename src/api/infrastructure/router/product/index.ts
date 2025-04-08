import { CategoryUseCase } from './../../../application/category/CategoryUseCase';
import { Router } from "express";
import { ProductRepository } from "../../repository/product/ProductRepository";
import { ProductUseCase } from "../../../application/product/productUseCase";
import { ProductController } from "../../controllers/Product/ProductController";
import { S3Service } from "../../../../shared/infrastructure/aws/S3Service";
import ProductModel from "../../models/products/ProductModel";
import { ProductValidations } from "../../../../shared/infrastructure/validation/Product/ProductValidation";
import { UserValidations } from "../../../../shared/infrastructure/validation/User/UserValidation";
import { CategoryRepository } from "../../repository/Category/CategoryRepository";
import CategoryModel from "../../models/CategoryModel";
import StockStoreHouseModel from '../../models/stockStoreHouse/StockStoreHouseModel';
import { StockStoreHouseRepository } from '../../repository/stockStoreHouse/StockStoreHouseRepository';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import { SubCategoryUseCase } from '../../../application/subCategory/SubCategoryUseCase';
import { SubCategoryRepository } from '../../repository/subCategory/SubCategoryRepository';
import SubCategoryModel from '../../models/SubCategoryModel';
import { VariantProductRepository } from '../../repository/variantProduct/VariantProductRepository';
import { VariantProductModel } from '../../models/variantProduct/VariantProductModel';
import { VariantProductUseCase } from '../../../application/variantProduct/VariantProductUseCase';
import { StockInputRepository } from '../../repository/stockBranch/StockInputRepository';
import { StockSHinputRepository } from '../../repository/stockStoreHouse/StockSHinputRepository';
import StockSHinputModel from '../../models/stockStoreHouse/StockSHinputModel';
import { StockSHinputUseCase } from '../../../application/storehouse/stockSHinputUseCase';
import { StockSHOutputRepository } from '../../repository/stockStoreHouse/StockSHOutputRepository';
import StockSHoutputModel from '../../models/stockStoreHouse/StockSHoutputModel';
import { StockSHoutputUseCase } from '../../../application/storehouse/stockSHoutputUseCase';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';

const productRouter = Router();

const productRepository = new ProductRepository(ProductModel);
const categoryRepository = new CategoryRepository(CategoryModel)
const subcategoryRepository = new SubCategoryRepository(SubCategoryModel)
const variantProductRepository = new VariantProductRepository(VariantProductModel)

const stockStoreHouseRepository = new StockStoreHouseRepository(StockStoreHouseModel);
const stockInputSHRepository = new StockSHinputRepository(StockSHinputModel)
const stockOutputSHRepository = new StockSHOutputRepository(StockSHoutputModel)

const productUseCase = new ProductUseCase(productRepository);
const categoryUseCase = new CategoryUseCase(categoryRepository)
const subCategoryUseCase = new SubCategoryUseCase(subcategoryRepository);
const stockStoreHouseUseCase = new StockStoreHouseUseCase(stockStoreHouseRepository);
const stockSHinputUseCase = new StockSHinputUseCase(stockInputSHRepository)
const stockSHOutputUseCase = new StockSHoutputUseCase(stockOutputSHRepository)
const variantProductUseCase = new VariantProductUseCase(variantProductRepository)

const s3Service = new S3Service();
const productvalidations = new ProductValidations()

const productController = new ProductController(productUseCase, categoryUseCase, stockStoreHouseUseCase, stockSHinputUseCase, stockSHOutputUseCase, s3Service, subCategoryUseCase, variantProductUseCase);
const userValidations = new UserValidations();

productRouter

  .get("/", productController.getAllProducts)
  .get("/paginate", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.getAllProductsPaginate)
  .get("/for_search", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.getProductsBySearch)
  .get("/:id", productController.getProduct)
  .get('/non-existent/get', productController.getNoStockProducts)
  .get('/productsByCategory/search', productController.getAllProductsByCategory)
  .get('/productsBySubCategory/search', productController.getAllProductsBySubCategory)
  .get("/productsByCategories/ok", productController.getProductsByCategories)
  .get("/recommendProducts/ok/:id", productController.getSimilarProducts)
  .get("/videos/ok", productController.getVideos)
  .get("/recentProducts/ok", productController.getRecentProducts)
  .post("/video/addVideo/:id", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.addOneVideoProduct)
  .post("/addProduct", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.createProduct)
  .post("/createProductWithVariants/ok", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.AddProdcutWithVariants)
  .post("/conditionProduct/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.conditionProduct)
  .post("/addVariants/:id", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.AddVariants)
  .post("/addVariants/clothes-shoes/:id", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.AddVariantsClothesShoes)
  .post("/selectSizeGuide/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.SelectSizeGuide)
  .post('/search-category', productController.getProductsByCategory)
  .post("/updateInfo/:id", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.updateProduct)
  .post("/addImageDetail/:id", productvalidations.imagesValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.addOneImageProduct)
  .post("/deleteImageDetail/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.deleteOneImageDetail)
  .post("/deleteVideoDetail/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.deleteVideoDetail)
  .post('/search/ok', productController.searchProduct)
  .post("/productsBySubCategory/ok", productController.getProductsBySubCategory)
  .post("/addDescriptionAndVideos/:id", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.addDescriptionAndVideo)
  .post("/updateMainFeatures/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.updateMainFeatures)
  .post("/updateVariants/:id", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.UpdateVariants)
  .post("/updateOrder/images/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.updatePositionImages)
  .put("/updateVideo/:id", productvalidations.videoValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.updateProductVideo)
  .put("/updateThumbnail/:id", productvalidations.thumbnailValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.updateThumbnail)
  .delete("/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), ActivityLogger, productController.deleteProduct)


export default productRouter;
