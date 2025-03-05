import { Router } from 'express';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';
import { ZoneRepository } from '../../repository/warehouse/ZoneRepository';
import { ZoneModel } from '../../models/warehouse/ZoneModel';
import { WarehouseUseCase } from '../../../application/warehouse/WarehouseUseCase';
import { AisleRepository } from '../../repository/warehouse/AisleRepository';
import { AisleModel } from '../../models/warehouse/AisleModel';
import { SectionRepository } from '../../repository/warehouse/SectionRepository';
import { SectionModel } from '../../models/warehouse/SectionModel';
import { WarehouseController } from '../../controllers/warehouseController/WarehouseController';
import { StockStoreHouseRepository } from '../../repository/stockStoreHouse/StockStoreHouseRepository';
import StockStoreHouseModel from '../../models/stockStoreHouse/StockStoreHouseModel';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';

const warehouseRouter = Router();

const zoneRepository     = new ZoneRepository(ZoneModel);
const aisleRepository = new AisleRepository(AisleModel)
const sectionRepository = new SectionRepository(SectionModel)
const stockStoreHouseRepository = new StockStoreHouseRepository(StockStoreHouseModel)

const warehouseUseCase = new WarehouseUseCase(zoneRepository,aisleRepository,sectionRepository) 
const stockStoreHouseUseCase = new StockStoreHouseUseCase(stockStoreHouseRepository)
const warehouseController     = new WarehouseController(warehouseUseCase, stockStoreHouseUseCase)
const userValidations = new UserValidations();

warehouseRouter
.get('/all_zones',userValidations.authTypeUserValidation(['SUPER-ADMIN']), warehouseController.getAllZones)
.get('/all_aisles',userValidations.authTypeUserValidation(['SUPER-ADMIN']), warehouseController.getAllAisles)
.get('/all_sections',userValidations.authTypeUserValidation(['SUPER-ADMIN']), warehouseController.getAllSections)
.get('/aisle/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']), warehouseController.getAisle)
.get('/section/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']), warehouseController.getSection)
.get('/print_section_code/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']), warehouseController.PrintPdfSection)
.get('/search_product_section/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']), warehouseController.searchProductSection)
.post('/add_zone',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.createZone)
.post('/add_aisle',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.createAisle)
.post('/add_section',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.createSection)
.post('/add_multiple_aisles',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.addMultipleAisles)
.post('/add_multiple_sections',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.addMultipleSections)
.post('/section/add_multiple_products',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.addMultipleProductsToSection)
.post('/section/add_product',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.addSingleProductToSection)
.post('/update_zone/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.updateZone)
.post('/update_aisle/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.updateAisle)
.post('/update_section/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.updateSection)
.delete('/delete_zone/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.deleteZone)
.delete('/delete_aisle/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.deleteAisle)
.delete('/delete_section/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, warehouseController.deleteSection)


export default warehouseRouter;
