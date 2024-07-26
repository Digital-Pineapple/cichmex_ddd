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

const productOrderController = new ProductOrderController(productOrderUseCase, s3Service);
const userValidations = new UserValidations();

productOrderRouter

  .get("/",userValidations.authTypeUserValidation(["SUPER-ADMIN"]), productOrderController.getAllProductOrders)
  .get("/paid",userValidations.authTypeUserValidation(["SUPER-ADMIN"]), productOrderController.paidProductOrders)
  .get('/resume', productOrderController.gerProductOrderResume)
  .get("/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CUSTOMER"]), productOrderController.getOneProductOrder)
  .get("/user/resume",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CUSTOMER"]), productOrderController.getOneProductOrderByUser)
  .post('/', productOrderController.createProductOrder)
  .post('/fill-order/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN",]), productOrderController.fillProductOrder)
  .post("/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN"]), productOrderController.updateProductOrder )
  .delete("/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN"]),productOrderController.deleteProductOrder)
  .get("/ordersByBranch/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER"]), productOrderController.getProductOrderByBranch);

export default productOrderRouter;
