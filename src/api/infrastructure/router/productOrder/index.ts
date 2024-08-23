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
const userValidations = new UserValidations();
const s3Service = new S3Service();
const productOrderController = new ProductOrderController(productOrderUseCase, s3Service);

productOrderRouter

  .get("/",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.getAllProductOrders)
  .get("/AssignedPO",userValidations.authTypeUserValidation(["SUPER-ADMIN"]), productOrderController.getAssignedPO)
  .get("/deliveries",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.getDeliveries)
  .get("/paid",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.paidProductOrders)
  .get("/pending-transfer",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.pendingTransferPO)
  .get("/paidAndSupplyToPoint",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.paidAndSupplyPOToPoint)
  .get("/paidAndSupply",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.paidAndSupplyPO)
  .get('/resume',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.gerProductOrderResume)
  .get("/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CUSTOMER", "ADMIN"]), productOrderController.getOneProductOrder)
  .get("/user/resume",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CUSTOMER"]), productOrderController.getOneProductOrderByUser)
  .get("/pdfOrder/:id", userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.pdfOrder)
  .post('/', productOrderController.createProductOrder)
  .post('/end-shipping',userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER"]), productOrderController.endShippingOrder)
  .post('/endShippingToPoint',userValidations.authTypeUserValidation(["PARTNER"]), productOrderController.endShippingOrdertoPoint)
  .post('/start-verifyQr',userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER"]), productOrderController.verifyQr)
  .post('/verifyQrToPoint',userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER"]), productOrderController.verifyQrToPoint)
  .post('/verifyStartRoute',userValidations.authTypeUserValidation(["SUPER-ADMIN"]), productOrderController.verifyAndStartRoute)
  .post('/assignRoute',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.AssignRoute)
  .post('/fill-order/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN",]), productOrderController.fillProductOrder)
  .post("/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN"]), productOrderController.updateProductOrder)
  .delete("/:id",userValidations.authTypeUserValidation(["CUSTOMER"]),productOrderController.deleteProductOrder)
  .get("/ordersByBranch/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER"]), productOrderController.getProductOrderByBranch);

export default productOrderRouter;
