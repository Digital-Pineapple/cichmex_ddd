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

const productRouter = Router();

const productRepository = new ProductRepository(ProductModel);
const categoryRepository = new CategoryRepository(CategoryModel)

const stockStoreHouseRepository    = new StockStoreHouseRepository(StockStoreHouseModel);

const productUseCase = new ProductUseCase(productRepository);
const categoryUseCase = new CategoryUseCase(categoryRepository)
const stockStoreHouseUseCase      = new StockStoreHouseUseCase(stockStoreHouseRepository);

const s3Service = new S3Service();
const productvalidations = new ProductValidations()

const productController = new ProductController(productUseCase, categoryUseCase,stockStoreHouseUseCase,  s3Service);
const userValidations = new UserValidations();

productRouter

.post("/create-product/ok",productvalidations.productValidation, productController.createProduct)
  .get("/", productController.getAllProducts)
  .get("/:id", productController.getProduct)
  .get('/non-existent/get', productController.getNoStockProducts)
  .post('/search-category', productController.getProductsByCategory)
  .post("/:id", productvalidations.productValidation,userValidations.authTypeUserValidation(['SUPER-ADMIN']), productController.updateProduct)
  .post('/search/ok', productController.searchProduct)
  .delete("/:id", userValidations.authTypeUserValidation(['SUPER-ADMIN']), productController.deleteProduct);

export default productRouter;
