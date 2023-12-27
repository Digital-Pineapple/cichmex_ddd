import { Router } from "express";
import { ProductRepository } from "../../repository/product/ProductRepository";
import { ProductUseCase } from "../../../application/product/productUseCase";
import { ProductController } from "../../controllers/Product/ProductController";
import { S3Service } from "../../../../shared/infrastructure/aws/S3Service";
import ProductModel from "../../models/ProductModel";
import { ProductValidations } from "../../../../shared/infrastructure/validation/Product/ProductValidation";

const productRouter = Router();

const productRepository = new ProductRepository(ProductModel);
const productUseCase = new ProductUseCase(productRepository);
const s3Service = new S3Service();
const productvalidations = new ProductValidations()
const productController = new ProductController(productUseCase, s3Service);

productRouter

  .get("/", productController.getAllProducts)
  .get("/:id", productController.getProduct)
  .post("/", productController.createProduct)
  .patch("/:id", productvalidations.productValidation, productController.updateProduct)
  .delete("/:id", productController.deleteProduct);

export default productRouter;
