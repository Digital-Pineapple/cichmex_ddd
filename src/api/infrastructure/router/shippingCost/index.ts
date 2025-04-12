import { Router } from "express";
import ShippingCostModel from "../../models/ShippingCostModel";
import { ShippingCostRepository } from "../../repository/shippingCostRepository/ShippingCostRepository";
import { ShippingCostUseCase } from "../../../application/shippingCost/ShippingCostUseCase";
import { ShippingCostController } from "../../controllers/shippingCost/shippingCostController";
import { UserValidations } from "../../../../shared/infrastructure/validation/User/UserValidation";
import { ActivityLogger } from "../../../../shared/infrastructure/middleware/ActivityLogger";
import { ShoppingCartRepository } from "../../repository/shoppingCart/ShoppingCartRepository";
import ShoppingCartModel from "../../models/ShoppingCartModel";
import { ShoppingCartUseCase } from "../../../application/shoppingCart.ts/ShoppingCartUseCase";


const shippingCostRouter = Router();
const shoppingCartRepository =  new ShoppingCartRepository(ShoppingCartModel);
const shippingCostRepository    = new ShippingCostRepository(ShippingCostModel);
const shippingCostUseCase      = new ShippingCostUseCase(shippingCostRepository);
const shoppingCartUseCase      = new ShoppingCartUseCase(shoppingCartRepository);
const shippingCostController   = new ShippingCostController(shippingCostUseCase, shoppingCartUseCase);

const userValidations = new UserValidations();

shippingCostRouter
    .get('/calculate',userValidations.authTypeUserValidation(["CUSTOMER"]), shippingCostController.calculateShippingCost)
    .get('/',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), shippingCostController.getAllShippingCost)
    .get('/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]),  shippingCostController.getOneShippingCost)
    .get('/find/price',userValidations.authTypeUserValidation(["CUSTOMER", "SUPER-ADMIN"]), shippingCostController.getShippingCostByWeight )
    .post('/',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), ActivityLogger, shippingCostController.creteShippingCost)
    .put('/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]),ActivityLogger,  shippingCostController.updateShippingCost)
    .delete('/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN", "ADMIN"]), ActivityLogger, shippingCostController.deleteShippingCost)

export default shippingCostRouter;
