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

const productRouter = Router();

const productRepository = new ProductRepository(ProductModel);
const categoryRepository = new CategoryRepository(CategoryModel)
const subcategoryRepository = new SubCategoryRepository(SubCategoryModel)
const variantProductRepository = new VariantProductRepository(VariantProductModel)

const stockStoreHouseRepository = new StockStoreHouseRepository(StockStoreHouseModel);
const stockInputSHRepository = new StockSHinputRepository(StockSHinputModel)

const productUseCase = new ProductUseCase(productRepository);
const categoryUseCase = new CategoryUseCase(categoryRepository)
const subCategoryUseCase = new SubCategoryUseCase(subcategoryRepository);
const stockStoreHouseUseCase = new StockStoreHouseUseCase(stockStoreHouseRepository);
const stockSHinputUseCase = new StockSHinputUseCase(stockInputSHRepository)
const variantProductUseCase = new VariantProductUseCase(variantProductRepository)

const s3Service = new S3Service();
const productvalidations = new ProductValidations()

const productController = new ProductController(productUseCase, categoryUseCase, stockStoreHouseUseCase,stockSHinputUseCase, s3Service, subCategoryUseCase, variantProductUseCase);
const userValidations = new UserValidations();

productRouter

.get("/", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.getAllProducts)
.get("/paginate", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.getAllProductsPaginate)
  .get("/:id", productController.getProduct)
  .get('/non-existent/get', productController.getNoStockProducts)
  .post("/video/addVideo/:id",productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.addOneVideoProduct)
  .post("/addProduct", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.createProduct)
  .post("/createProductWithVariants/ok", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.AddProdcutWithVariants)
  .post("/conditionProduct/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.conditionProduct)
  .post("/addVariants/:id",productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.AddVariants)
  .post("/addVariants/clothes-shoes/:id",productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.AddVariantsClothesShoes)
  .post("/selectSizeGuide/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.SelectSizeGuide)
  .post('/search-category', productController.getProductsByCategory)
  .post("/updateInfo/:id", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.updateProduct)
  .put("/updateVideo/:id", productvalidations.videoValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.updateProductVideo)
  .put("/updateThumbnail/:id", productvalidations.thumbnailValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.updateThumbnail)
  .post("/addImageDetail/:id", productvalidations.imagesValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.addOneImageProduct)
  .post("/deleteImageDetail/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.deleteOneImageDetail)
  .post("/deleteVideoDetail/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.deleteVideoDetail )
  .post('/search/ok', productController.searchProduct)
  .get("/productsByCategories/ok", productController.getProductsByCategories)
  .post("/productsBySubCategory/ok", productController.getProductsBySubCategory)
  .get("/videos/ok", productController.getVideos)
  .get("/recommendProducts/ok/:id", productController.getSimilarProducts)
  .delete("/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.deleteProduct)  
  .get("/products/urls", productController.updateURLS)  
  .post("/addDescriptionAndVideos/:id", productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.addDescriptionAndVideo)
  .post("/updateMainFeatures/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.updateMainFeatures)
  .post("/updateVariants/:id",productvalidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.UpdateVariants)
  .post("/updateOrder/images/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), productController.updatePositionImages)
  .get("/newlyAddedProducts", productController.getNewlyAddedProducts)

export default productRouter;
