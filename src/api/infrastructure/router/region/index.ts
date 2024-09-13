import { Router } from 'express';
import { RegionRepository } from '../../repository/region/RegionRepository';
import RegionModel from '../../models/Regions/RegionModel';
import { RegionUseCase } from '../../../application/regions/regionUseCase';
import { RegionController } from '../../controllers/Regions/RegionController';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';


const regionRouter = Router();

const regionRepository    = new RegionRepository (RegionModel);
const regionUseCase      = new RegionUseCase (regionRepository);
const regionController   = new RegionController(regionUseCase);
const userValidation = new UserValidations()

regionRouter

    .get('/',userValidation.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), regionController.getAllRegions)
    .get('/:id',userValidation.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), regionController.getOneRegion)
    .post("/", userValidation.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), regionController.createRegion )
    .put("/update/:id",userValidation.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), regionController.updateRegion)
    .delete("/:id",userValidation.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), regionController.deteleRegion)

export default regionRouter;

