import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { DiscountCouponUseCase } from '../../../application/discountCoupon/DiscountCouponUseCase';
import { generateUUID } from '../../../../shared/infrastructure/validation/Utils';
import { ConsumeCouponUseCase } from '../../../application/discountCoupon/ConsumeCouponUseCase';
import { validate } from 'uuid';
import { ShoppingCartUseCase } from '../../../application/shoppingCart.ts/ShoppingCartUseCase';
import { StockReturnRepository } from '../../repository/stockBranch/StockReturnRepository';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';


export class DiscountCouponController extends ResponseData {
    protected path = '/discount-coupon';

    constructor(
        private readonly discountCouponUseCase: DiscountCouponUseCase,
        private readonly consumeCouponUseCase: ConsumeCouponUseCase,
        private readonly shoppingCartUseCase: ShoppingCartUseCase,
        private readonly productOrderUseCase : ProductOrderUseCase,
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
        this.processedCoupon = this.processedCoupon.bind(this)

    }

    public async getOneDiscountDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params

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

    public async processedCoupon(coupon: any, shoppingCart: any) {
        const products = shoppingCart.products;
        let total = 0;
        let discount_apply = 0;
        let shipping_cost = true;
        let productsDiscount = [...products];
     
        const precios = productsDiscount.map((entry: any) =>
            
            entry.variant?.price
                ? entry.variant?.price * entry.quantity
                : entry.item.price * entry.quantity
        );
        const originalSum = precios.reduce((suma: number, currentValue: number) => suma + currentValue, 0);
      
        
    
        // Validar monto mínimo del carrito (usa el total original)
        if (originalSum < coupon.min_cart_amount) {
            return new ErrorHandler(`El monto mínimo de compra es de ${coupon.min_cart_amount}`, 400);
        }
    
        total = originalSum;
    
        // 1. Aplicar descuentos por porcentaje
        if (coupon.percent > 0) {
            if (coupon.for_all_products === false) { 
                const discountProductIds = coupon.products.map((id: any) => id.toString());
                const applicableProducts = products.filter((product: any) => 
                    discountProductIds.includes(product.item._id.toString())
                );
                if (applicableProducts.length <= 0) {
                    return new ErrorHandler(`No aplicable a estos productos`, 400);
                }
    
                
                const subtotalDiscountable = applicableProducts.reduce(
                    (sum: number, product: any) => sum + (product.variant?.price ?? product.item.price) * product.quantity,
                    0
                );
              
    
                const totalDiscountAmount = (coupon.percent / 100) * subtotalDiscountable;
                const maxDiscountAmount = (coupon.percent / 100) * coupon.max_cart_amount;
                const discountToApply = Math.min(totalDiscountAmount, maxDiscountAmount);
            
                discount_apply += discountToApply;
                total -= discountToApply;
                
                
    
                // Actualizar precios en productsDiscount
                productsDiscount = products.map((product: any) => {
                    const itemId = product.item._id.toString();
                    if (!discountProductIds.includes(itemId)) return product._doc;
                    
                    const originalPrice = product.variant?.price ?? product.item.price;
                    const proportion = (originalPrice * product.quantity) / subtotalDiscountable;
                    const productDiscount = discountToApply * proportion;
                    const finalPrice = originalPrice - (productDiscount / product.quantity);
                    
                    return { 
                        ...product._doc, 
                        price: finalPrice,
                        discountAmount: productDiscount
                    };
                });

    
            } else { // Descuento en todos los productos
                const discountAmount = (coupon.percent / 100) * originalSum;
                const maxDiscountAmount = (coupon.percent / 100) * coupon.max_cart_amount;
                const discountToApply = Math.min(discountAmount, maxDiscountAmount);
                
                discount_apply += discountToApply;
                total -= discountToApply;
            }
        }
    
        // 2. Aplicar descuentos fijos
        if (coupon.fixed_amount > 0) {
            const fixedDiscount = Math.min(coupon.fixed_amount, total);
            discount_apply += fixedDiscount;
            total -= fixedDiscount;
        }
    
        // 3. Aplicar envío gratis
        if (coupon.type_discount === 'free_shipping') {
            shipping_cost = false;
        }
    
        // Asegurar total no negativo
        total = Math.max(total, 0);
    
        return {
            subtotal_price: originalSum,
            percentage : coupon.percent > 0? coupon.percent : null,
            amount: coupon.fixed_amount > 0 ? coupon.fixed_amount : null,
            discount_apply: discount_apply,
            total_price: total,
            shipping_cost,
            products: productsDiscount,
            type: coupon?.type_discount,
            code: coupon?.code
        };
    }


    public async findCoupon(req: Request, res: Response, next: NextFunction) {
        const { id } = req.user;
        const { code } = req.body;
        let response = {}
        try {
            let coupon: any = await this.discountCouponUseCase.findOneDiscountCoupon(code);
            if (coupon instanceof ErrorHandler) {
                response = coupon
            }
            const FirstBuy : any = await this.productOrderUseCase.ProductOrdersByUser(id ? id : '')
    
            if (FirstBuy.length > 0 && coupon.type_discount === 'first_buy') {
                next(new ErrorHandler('Aplicable solo a la primera compra', 500))
            }

            const shoppingCart = await this.shoppingCartUseCase.getShoppingCartByUser(id)
            if (shoppingCart instanceof ErrorHandler) {
                return this.invoke(shoppingCart, 400, res, 'Error al encontrar carrito de compras', next);
            }

            const noRepeat = await this.consumeCouponUseCase.findOneConsumeCoupon(id, coupon?._id);
            if (noRepeat) {
                next(new ErrorHandler('El cupon ya ha sido canjeado', 500))
            }

            if (coupon.unlimited) {
                response = await this.processedCoupon(coupon, shoppingCart)

            }
            if (coupon.maxUses > 0) {
                const uses: any = await this.consumeCouponUseCase.findConsumesCoupon(coupon._id)
                if (uses?.length >= coupon.maxUses) {
                    next(new ErrorHandler('El cupon ya ha se ha agotado canjeado', 500))
                }
                else {
                    response = await this.processedCoupon(coupon, shoppingCart)
                }
            }

            this.invoke(response, 200, res, '', next);

        } catch (error) {
            console.log(error);
            
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
                percent: values.fixed_amount ? 0 : isNaN(Number(values?.percent)) ? undefined : Number(values?.percent),
                fixed_amount: values.percent ? 0 : isNaN(Number(values?.fixed_amount)) ? undefined : Number(values?.fixed_amount),
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
            const response = await this.discountCouponUseCase.updateDiscountCoupon(id, { ...data });
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
            const response = await this.discountCouponUseCase.updateDiscountCoupon(id, { is_active: is_active });
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

