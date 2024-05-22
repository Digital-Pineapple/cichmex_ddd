import { Router } from "express";
import { ProductOrderRepository } from "../../repository/product/ProductOrderRepository";
import { S3Service } from "../../../../shared/infrastructure/aws/S3Service";
import { ProductValidations } from "../../../../shared/infrastructure/validation/Product/ProductValidation";
import { UserValidations } from "../../../../shared/infrastructure/validation/User/UserValidation";
import ProductOrderModel from '../../models/products/ProductOrderModel';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';
import { ProductOrderController } from '../../controllers/Product/ProductOrderController';

const productOrderRouter = Router();

const productOrderRepository = new ProductOrderRepository(ProductOrderModel);


const productOrderUseCase = new ProductOrderUseCase(productOrderRepository);


const s3Service = new S3Service();
const productvalidations = new ProductValidations()

const productOrderController = new ProductOrderController(productOrderUseCase);
const userValidations = new UserValidations();

productOrderRouter

  .get("/", productOrderController.getAllProductOrders)
  .get("/:id", productOrderController.getOneProductOrder)
  .post('/', productOrderController.createProductOrder)
  .post("/:id", productOrderController.updateProductOrder )
  .delete("/:id",productOrderController.deleteProductOrder);

export default productOrderRouter;
