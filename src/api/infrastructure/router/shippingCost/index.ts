import { Router } from "express";
import ShippingCostModel from "../../models/ShippingCostModel";
import { ShippingCostRepository } from "../../repository/shippingCostRepository/ShippingCostRepository";
import { ShippingCostUseCase } from "../../../application/shippingCost/ShippingCostUseCase";
import { ShippingCostController } from "../../controllers/shippingCost/shippingCostController";
import { UserValidations } from "../../../../shared/infrastructure/validation/User/UserValidation";


const shippingCostRouter = Router();

const shippingCostRepository    = new ShippingCostRepository(ShippingCostModel);
const shippingCostUseCase      = new ShippingCostUseCase(shippingCostRepository);

const shippingCostController   = new ShippingCostController(shippingCostUseCase);

const userValidations = new UserValidations();

shippingCostRouter
    .get('/',userValidations.authTypeUserValidation(["SUPER-ADMIN"]), shippingCostController.getAllShippingCost)
    .get('/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN"]),  shippingCostController.getOneShippingCost)
    .post('/',userValidations.authTypeUserValidation(["SUPER-ADMIN"]),  shippingCostController.creteShippingCost)
    .put('/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN"]),  shippingCostController.updateShippingCost)
    .delete('/:id',userValidations.authTypeUserValidation(["SUPER-ADMIN"]),  shippingCostController.deleteShippingCost)

    

export default shippingCostRouter;
