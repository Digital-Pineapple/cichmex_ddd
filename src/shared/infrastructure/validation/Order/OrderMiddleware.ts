import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from "../../../domain/ErrorHandler";
export const validateOrderFields = async (req: Request, res: Response, next: NextFunction) => {    

    const { products, redirect_urls, cart, total, subtotal, shipping_cost, address_id, branch_id, user_id, type_delivery } = req.body;      
    if(!user_id) return next(new ErrorHandler("el id del usuario es requerido", 404));          
    // if(!shipping_cost) return next(new ErrorHandler("el costo de envio es requerido", 404));          
    if(!Array.isArray(products) || products.length === 0) return next(new ErrorHandler("los productos son requeridos y deben ser validos", 404)); // Enviar error al siguiente middleware         
    if(!Array.isArray(cart) || cart.length === 0) return next(new ErrorHandler("el carrito es requerido y debe ser valido", 404)); // Enviar error al siguiente middleware         
    if(!redirect_urls) return next(new ErrorHandler("las back urls son requeridas", 404)); // Enviar error al siguiente middleware         
    if(!total) return next(new ErrorHandler("el total es requerido", 404));   
    if(!subtotal) return next(new ErrorHandler("el subtotal es requerido", 404));   
    if(!type_delivery) return next(new ErrorHandler("el type_delivery es requerido", 404))                
    // if(type_delivery !== "homedelivery" || type_delivery !== "pickup" ) return next(new ErrorHandler("typedelivery invalido", 404))
    if(type_delivery === "homedelivery" && !address_id ) return next(new ErrorHandler("el id de dirección es requerida", 404))
    if(type_delivery === "pickup" && !branch_id ) return next(new ErrorHandler("id de sucursal es requerida", 404))
    next();
   
};