import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { DiscountCouponUseCase } from '../../../application/discountCoupon/DiscountCouponUseCase';
import { generateUUID } from '../../../../shared/infrastructure/validation/Utils';
import { ConsumeCouponUseCase } from '../../../application/discountCoupon/ConsumeCouponUseCase';
import { validate } from 'uuid';


export class DiscountCouponController extends ResponseData {
    protected path = '/discount-coupon';

    constructor(
        private readonly discountCouponUseCase: DiscountCouponUseCase,
        private readonly consumeCouponUseCase: ConsumeCouponUseCase
    ) {
        super();
        this.getAllDiscountCoupons = this.getAllDiscountCoupons.bind(this);
        this.findCoupon = this.findCoupon.bind(this);
        this.consumeOneCoupon = this.consumeOneCoupon.bind(this);
        this.createDiscountCoupon = this.createDiscountCoupon.bind(this);
        this.updateDiscountCoupon = this.updateDiscountCoupon.bind(this);
        this.deleteDiscountCoupon = this.deleteDiscountCoupon.bind(this);
        this.getOneDiscountDetail = this.getOneDiscountDetail.bind(this);
        this.changeActiveDiscount = this.changeActiveDiscount.bind(this);

    }

    public async getOneDiscountDetail(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        
        try {
            const response = await this.discountCouponUseCase.getOneDiscountDetails(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getAllDiscountCoupons(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.discountCouponUseCase.findAllDiscountCoupons()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async findCoupon(req: Request, res: Response, next: NextFunction) {
        const { id } = req.user;
        const { code, cart_amount } = req.body;
        // console.log("code:", code, "cart_amount:", cart_amount);
        
    
        try {
            let response: any | null = await this.discountCouponUseCase.findOneDiscountCoupon(code);
    
            if (response instanceof ErrorHandler) {
                return this.invoke(response, 400, res, 'Error al encontrar el cupón', next);
            }
    
            const noRepeat = await this.consumeCouponUseCase.findOneConsumeCoupon( id, response?.uuid );
    
            if (noRepeat) {
                // return this.invoke(new ErrorHandler('Código canjeado anteriormente', 400), 400, res, 'Código canjeado anteriormente', next);
                return this.invoke(response, 400, res, 'Código canjeado anteriormente', next);
            }

            if(response.fixed_amount) {                
                if(cart_amount >= response.min_cart_amount) {
                    response = {
                        uuid: response?.uuid,
                        isCouponFixedAmount: true,
                        isCouponPorcent: false,
                        free_shipping: false,                       
                        code: response.code,
                        cart_amount: cart_amount,
                        totalWithDiscount: cart_amount - response.fixed_amount,
                        discount_porcent: (response.fixed_amount*100)/cart_amount,
                        discount_amount: response.fixed_amount,
                    };                     
                }else{
                    return next(new ErrorHandler(`se requiere un monto de carrito arriba de ${response.min_cart_amount}`, 403));     
                }
            }else if(response.porcent) {
                if(cart_amount >= response.min_cart_amount && cart_amount <= response.max_cart_amount) {
                    response = {
                        uuid: response?.uuid,
                        isCouponFixedAmount: false,
                        isCouponPorcent: true,
                        free_shipping: false,                   
                        code: response.code,
                        cart_amount: cart_amount,
                        totalWithDiscount: cart_amount - cart_amount*(response.porcent/100),
                        discount_porcent: response.porcent,  
                        discount_amount: cart_amount*(response.porcent/100),   
                    };
                }else{
                    return next(new ErrorHandler(`se requiere un monto de carrito arriba de ${response.min_cart_amount} y menor de ${response.max_cart_amount}`, 403));                      
                }
            }else if(response.free_shipping) {
                response = {
                    uuid: response?.uuid,
                    isCouponFixedAmount: false,
                    isCouponPorcent: false,
                    free_shipping: true,                   
                    code: response.code,
                    cart_amount: cart_amount,
                    totalWithDiscount: cart_amount,
                    discount_porcent: 0,  
                    discount_amount: 0,   
                };
            }
            this.invoke(response, 200, res, '', next);
            
        } catch (error) {
            next(new ErrorHandler('Error al buscar el código', 500));
        }
    }
    

    public async createDiscountCoupon(req: Request, res: Response, next: NextFunction) {
        const { values } = req.body;
        const uuid = generateUUID();
    
        try {
            const parsedValues = {
                ...values,
                uuid,
                fixed_amount: Number(values.fixed_amount),
                min_cart_amount: Number(values.min_cart_amount),
                max_cart_amount: Number(values.max_cart_amount),
                maxUses: Number(values.maxUses),
            };
    
            const response = await this.discountCouponUseCase.createDiscountCoupon(parsedValues);
            this.invoke(response, 200, res, 'Creado con éxito', next);
        } catch (error) {
            console.error(error);
            next(new ErrorHandler('Error al crear', 500));
        }
    }
    
    public async updateDiscountCoupon(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { values } = req.body;

        try {
            // Construcción de datos con validación
            let data: Record<string, any> = {
                name: values.name,
                description: values.description,
                percent: isNaN(Number(values?.percent)) ? undefined : Number(values?.percent),
                fixed_amount: isNaN(Number(values?.fixed_amount)) ? undefined : Number(values?.fixed_amount),
                unlimited: values.unlimited,
                start_date: values.start_date,
                expiration_date: values.expiration_date,
                for_all_products: values.for_all_products,
                products: values.products,
                min_cart_amount: isNaN(Number(values?.min_cart_amount)) ? undefined : Number(values?.min_cart_amount),
                max_cart_amount: isNaN(Number(values?.max_cart_amount)) ? undefined : Number(values?.max_cart_amount),
                maxUses: isNaN(Number(values?.maxUses)) ? undefined : Number(values?.maxUses),
                is_active: values.is_active,
            };
    
            // Eliminar propiedades con valores `undefined`
            data = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
            const response = await this.discountCouponUseCase.updateDiscountCoupon(id, data);
            this.invoke(response, 200, res, 'Editado con éxito', next);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Error al editar', 500));
        }
    }

    public async changeActiveDiscount(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { is_active } = req.body;
        try {
            const response = await this.discountCouponUseCase.updateDiscountCoupon(id, {is_active: is_active});
            this.invoke(response, 200, res, 'Editado con éxito', next);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Error al editar', 500));
        }
    }
    
    
    public async consumeOneCoupon(req: Request, res: Response, next: NextFunction) {
        const { id } = req.user;
        const { coupon } = req.body;
        const uuid = generateUUID();
    
        try {
            const couponExist = await this.discountCouponUseCase.findOneDiscountCouponByUuid(coupon);
    
            if (couponExist instanceof ErrorHandler) {
                return this.invoke(couponExist, 400, res, 'Error al encontrar el cupón', next);
            }
    
            const response = await this.consumeCouponUseCase.createConsumeCoupon({ user: id, discount_coupon: coupon, uuid: uuid });
    
            if (response instanceof ErrorHandler) {
                return this.invoke(response, 400, res, 'Error al canjear el cupón', next);
            }
            this.invoke(response, 200, res, 'Canjeado con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Error al aplicar cupón', 500));
        }
    }
    
    public async deleteDiscountCoupon(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.discountCouponUseCase.deleteDiscountCoupon(id)
            this.invoke(response, 200, res, 'Eliminado con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Error al eliminar', 500));
        }
    }



}

