import { StockStoreHouseRepository } from './../../repository/stockStoreHouse/StockStoreHouseRepository';
import { Router } from "express";
import { ProductOrderRepository } from "../../repository/product/ProductOrderRepository";
import { S3Service } from "../../../../shared/infrastructure/aws/S3Service";
import { UserValidations } from "../../../../shared/infrastructure/validation/User/UserValidation";
import ProductOrderModel from '../../models/products/ProductOrderModel';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';
import { ProductOrderController } from '../../controllers/Product/ProductOrderController';
import { RegionRepository } from "../../repository/region/RegionRepository";
import RegionModel from "../../models/Regions/RegionModel";
import { RegionUseCase } from "../../../application/regions/regionUseCase";
import { RegionsService } from "../../../../shared/infrastructure/Regions/RegionsService";
import StockStoreHouseModel from '../../models/stockStoreHouse/StockStoreHouseModel';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';

const productOrderRouter = Router();
const stockStoreHouseRepository = new StockStoreHouseRepository(StockStoreHouseModel);
const regionRepository = new RegionRepository(RegionModel)
const productOrderRepository = new ProductOrderRepository(ProductOrderModel);
const productOrderUseCase = new ProductOrderUseCase(productOrderRepository);
const regionUseCase = new RegionUseCase(regionRepository)
const stockStoreHouseUseCase = new StockStoreHouseUseCase(stockStoreHouseRepository)
const userValidations = new UserValidations();
const s3Service = new S3Service();
const regionsService = new RegionsService()
const productOrderController = new ProductOrderController(productOrderUseCase,regionUseCase, s3Service, regionsService, stockStoreHouseUseCase);

productOrderRouter

  .get("/",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.getAllProductOrders)
  .get("/AssignedPO",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER"]), productOrderController.getAssignedPO)
  .get("/deliveries",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN", "CARRIER-DRIVER"]), productOrderController.getDeliveries)
  .get("/paid",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.paidProductOrders)
  .get("/paidAndFill/find",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.paidAndFillProductOrders)
  .get("/pending-transfer",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.pendingTransferPO)
  .get("/paidAndSupplyToPoint",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.paidAndSupplyPOToPoint)
  .get("/paidAndSupply",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.paidAndSupplyPO)
  .get('/resume',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.gerProductOrderResume)
  .get("/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CUSTOMER", "ADMIN", "CARRIER-DRIVER"]), productOrderController.getOneProductOrder)
  .get("/user/resume",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CUSTOMER"]), productOrderController.getOneProductOrderByUser)
  .get("/pdfOrder/:id", userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN", "CARRIER-DRIVER"]), productOrderController.pdfOrder)
  .get("/autoAssignOrders/region",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER"]), productOrderController.autoAssignProductOrders)
  .get("/readyToPoint/ok",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER"]), productOrderController.ReadyProductOrdersToPoint)
  .get('/verifyPackage/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER"]), productOrderController.VerifyPackage)
  .get('/optimation/RouteDelivery', userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER"]), productOrderController.OptimizedPackagesToPoint)
  .get('/outOfRegions/get', userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.OutOfRegionsPO)
  .post('/', productOrderController.createProductOrder)
  .post('/end-shipping',userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER"]), productOrderController.endShippingOrder)
  .post('/endShippingToPoint',userValidations.authTypeUserValidation(["PARTNER"]), productOrderController.endShippingOrdertoPoint)
  .post('/start-verifyQr',userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER"]), productOrderController.verifyQr)
  .post('/verifyQrToPoint',userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER"]), productOrderController.verifyQrToPoint)
  .post('/verifyStartRoute',userValidations.authTypeUserValidation(["SUPER-ADMIN"]), productOrderController.verifyAndStartRoute)
  .post('/assignRoute',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.AssignRoute)
  .post('/fill-order/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN","ADMIN"]), productOrderController.fillProductOrder)
  .post("/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN"]), productOrderController.updateProductOrder)
  .delete("/:id",userValidations.authTypeUserValidation(["CUSTOMER"]),productOrderController.deleteProductOrder)
  .get("/ordersByBranch/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER"]), productOrderController.getProductOrderByBranch);

export default productOrderRouter;
