import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { PaymentUseCase } from '../../../application/payment/paymentUseCase';
import { stringify } from 'uuid';
import { MPService } from '../../../../shared/infrastructure/mercadopago/MPService';
import { ShoppingCartUseCase } from '../../../application/shoppingCart.ts/ShoppingCartUseCase';

export class ShoppingCartController extends ResponseData {
    protected path = '/shoppingCart'

    constructor(private shoppingCartUseCase: ShoppingCartUseCase,
    ) {
        super();
        this.getAllShoppingCarts = this.getAllShoppingCarts.bind(this);
        this.getShoppingCart = this.getShoppingCart.bind(this);
        this.createShoppingCart = this.createShoppingCart.bind(this);
        this.updateShoppingCart = this.updateShoppingCart.bind(this);
        this.deleteShoppingCart = this.deleteShoppingCart.bind(this);
        this.deleteMembershipInCart = this.deleteMembershipInCart.bind(this)

    }

    public async getAllShoppingCarts(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.shoppingCartUseCase.getShoppingCarts();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getShoppingCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.shoppingCartUseCase.getShoppingCartByUser(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }


    public async createShoppingCart(req: Request, res: Response, next: NextFunction) {
        const { user_id, products, membership } = req.body;
        try {
            const response = await this.shoppingCartUseCase.createShoppingCart({ user_id, products, memberships:membership })
            this.invoke(response, 201, res, '', next)
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Error', 500));
        }
    }

    public async updateShoppingCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { products, membership } = req.body;

        try {
            const response = await this.shoppingCartUseCase.updateShoppingCart(id, { products, memberships: membership })
            this.invoke(response, 201, res, '', next)
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Error', 500));
        }
    }

    public async deleteShoppingCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.shoppingCartUseCase.deleteShoppingCart(id);
            this.invoke(response, 201, res, 'Eliminado con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }
    public async deleteMembershipInCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        console.log(id,'kjnknknk');
        
        try {
            const response = await this.shoppingCartUseCase.updateShoppingCart(id,{memberships:[]})
            console.log(response);
            
            this.invoke(response, 201, res, 'Eliminado con exito', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }



}