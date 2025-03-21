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
import { DocumentationValidations } from '../../../../shared/infrastructure/validation/Documentation/DocumentationValidation';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';

const productOrderRouter = Router();
const stockStoreHouseRepository = new StockStoreHouseRepository(StockStoreHouseModel);
const regionRepository = new RegionRepository(RegionModel)
const productOrderRepository = new ProductOrderRepository(ProductOrderModel);
const productOrderUseCase = new ProductOrderUseCase(productOrderRepository);
const regionUseCase = new RegionUseCase(regionRepository)
const stockStoreHouseUseCase = new StockStoreHouseUseCase(stockStoreHouseRepository)
const userValidations = new UserValidations();
const documentationValidations = new DocumentationValidations()
const s3Service = new S3Service();
const regionsService = new RegionsService()
const productOrderController = new ProductOrderController(productOrderUseCase,regionUseCase, s3Service, regionsService, stockStoreHouseUseCase);

productOrderRouter

  .get('/optimation_to_delivery', userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER", "ADMIN"]), productOrderController.OptimizedPackagesToDelivery)
  .get("/pending-transfer",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.pendingTransferPO)
  .get("/ready_to_delivery",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER", "ADMIN"]), productOrderController.ReadyProductOrdersToDelivery)
  .get("/paid/all",userValidations.authTypeUserValidation(["SUPER-ADMIN","ADMIN","WAREHOUSEMAN","WAREHOUSE-MANAGER"]), productOrderController.paidProductOrders)
  .get("/",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.getAllProductOrders)
  .get("/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CUSTOMER", "ADMIN", "CARRIER-DRIVER", "WAREHOUSEMAN", "WAREHOUSE-MANAGER"]), productOrderController.getOneProductOrder)
  .get("/AssignedPO",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER", "ADMIN"]), productOrderController.getAssignedPO)
  .get("/AssignedPO/user",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER", "ADMIN"]), productOrderController.getAssignedPOUser)
  .get("/deliveries",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN", "CARRIER-DRIVER"]), productOrderController.getDeliveries)
  .get("/paidAndFill/find",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN", "WAREHOUSEMAN", "WAREHOUSE-MANAGER"]), productOrderController.paidAndFillProductOrders)
  .get("/paidAndSupplyToPoint",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.paidAndSupplyPOToPoint)
  .get("/paidAndSupply",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.paidAndSupplyPO)
  .get('/resume',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.gerProductOrderResume)
  .get("/user/resume",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CUSTOMER", "ADMIN"]), productOrderController.getOneProductOrderByUser)
  .get("/pdfOrder/:id", userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN", "CARRIER-DRIVER", "WAREHOUSEMAN", "WAREHOUSE-MANAGER"]), productOrderController.pdfOrder)
  .get("/autoAssignOrders/region",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER", "ADMIN"]), productOrderController.autoAssignProductOrders)
  .get("/readyToPoint/ok",userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER", "ADMIN"]), productOrderController.ReadyProductOrdersToPoint)
  .get('/verifyPackage/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER", "ADMIN"]), productOrderController.VerifyPackage)
  .get('/optimation/RouteDelivery', userValidations.authTypeUserValidation(["SUPER-ADMIN", "CARRIER-DRIVER", "ADMIN"]), productOrderController.OptimizedPackagesToPoint)
  .get('/outOfRegions/get', userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), productOrderController.OutOfRegionsPO)
  .post('/', productOrderController.createProductOrder)
  .post('/end-shipping',userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER", "ADMIN"]),ActivityLogger, productOrderController.endShippingOrder)
  .post('/endShippingToPoint',userValidations.authTypeUserValidation(["PARTNER", "ADMIN"]),ActivityLogger, productOrderController.endShippingOrdertoPoint)
  .post('/start-verifyQr',userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER", "ADMIN"]),ActivityLogger, productOrderController.verifyQr)
  .put('/verifyQrToPoint',userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER", "ADMIN"]),ActivityLogger, productOrderController.verifyQrToPoint)
  .post('/verifyStartRoute',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]),ActivityLogger, productOrderController.verifyAndStartRoute)
  .post('/assignRoute', documentationValidations.PDFFileValidation ,userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN", "WAREHOUSE-MANAGER", "WAREHOUSEMAN"]),ActivityLogger, productOrderController.AssignRoute)
  .post('/fill-order/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN","ADMIN", "WAREHOUSEMAN", "WAREHOUSE-MANAGER"]),ActivityLogger,  productOrderController.fillProductOrder)
  .post("/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), ActivityLogger,productOrderController.updateProductOrder)
  .post("/fill_one_product/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN", "WAREHOUSEMAN", "WAREHOUSE-MANAGER"]), ActivityLogger,productOrderController.fillOneProduct)
  .put("/start_routes",userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN", "CARRIER-DRIVER"]), ActivityLogger,productOrderController.startMyRoutes)
  .delete("/:id",userValidations.authTypeUserValidation(["CUSTOMER"]),ActivityLogger, productOrderController.deleteProductOrder)
  .get("/ordersByBranch/:id",userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER", "ADMIN"]), productOrderController.getProductOrderByBranch);

export default productOrderRouter;
