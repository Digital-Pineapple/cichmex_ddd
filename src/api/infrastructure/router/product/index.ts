import { Router } from "express";
import { ProductRepository } from "../../repository/product/ProductRepository";
import { ProductUseCase } from "../../../application/product/productUseCase";
import { ProductController } from "../../controllers/Product/ProductController";
import { S3Service } from "../../../../shared/infrastructure/aws/S3Service";
import ProductModel from "../../models/ProductModel";
import { ProductValidations } from "../../../../shared/infrastructure/validation/Product/ProductValidation";
import { UserValidations } from "../../../../shared/infrastructure/validation/User/UserValidation";

const productRouter = Router();

const productRepository = new ProductRepository(ProductModel);
const productUseCase = new ProductUseCase(productRepository);
const s3Service = new S3Service();
const productvalidations = new ProductValidations()
const productController = new ProductController(productUseCase, s3Service);
const userValidations = new UserValidations();

productRouter

  .get("/", userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57','65a8193ae6f31eef3013bc59']), productController.getAllProducts)
  .get("/:id", userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57','65a8193ae6f31eef3013bc59']), productController.getProduct)
  .post("/", userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), productController.createProduct)
  .patch("/:id", productvalidations.productValidation, productController.updateProduct)
  .delete("/:id", userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), productController.deleteProduct);

export default productRouter;
