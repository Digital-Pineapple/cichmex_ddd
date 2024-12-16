import { Router } from 'express';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { ColorProductRepository } from '../../repository/colorProduct/ColorProductRepository';
import { ColorProductUseCase } from '../../../application/colorProduct/ColorProductUseCase';
import ColorProductModel from '../../models/colorProduct/ColorProduct';
import { ColorProductController } from '../../controllers/colorProduct/ColorProductController';


const colorProductRouter = Router();

const colorProductRepository    = new ColorProductRepository(ColorProductModel);
const colorProductUseCase      = new ColorProductUseCase(colorProductRepository);
const colorProductController   = new ColorProductController(colorProductUseCase);
const userValidations = new UserValidations();

colorProductRouter
.get('/',colorProductController.getAllColors)
.get('/seedColors',userValidations.authTypeUserValidation(['SUPER-ADMIN']),colorProductController.seedColors)
.post('/',colorProductController.addOneColor)
    
    

export default colorProductRouter;

