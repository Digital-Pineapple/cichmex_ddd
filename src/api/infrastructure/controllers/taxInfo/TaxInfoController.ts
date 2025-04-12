import { Request, Response, NextFunction, response } from 'express';

import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";

import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { TaxInfoUseCase } from '../../../application/taxInfo/TaxInfoUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { FacturapiService } from '../../../../shared/infrastructure/facturapi/FacturapiService';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';

export class TaxInfoController extends ResponseData {
    protected path = '/type-car'

    constructor(
         private taxInfoUseCase: TaxInfoUseCase, 
         private readonly s3Service: S3Service,
         private readonly facturapiService : FacturapiService,
         private readonly productOrderUseCase: ProductOrderUseCase
        ) {
        super();
        this.getAllTaxInfo     = this.getAllTaxInfo.bind(this);
        this.getOneTaxInfo     = this.getOneTaxInfo.bind(this);
        this.createMyTaxInfo   = this.createMyTaxInfo.bind(this);
        this.updateMyTaxInfo   = this.updateMyTaxInfo.bind(this);
        this.updateOneTaxInfo  = this.updateOneTaxInfo.bind(this);
        this.deleteTaxInfo     = this.deleteTaxInfo.bind(this);
        this.createInvoice     = this.createInvoice.bind(this);
        this.downloadInvoice   = this.downloadInvoice.bind(this);
    }

    public async getAllTaxInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.taxInfoUseCase.getAllTaxInfo();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getOneTaxInfo(req: Request, res: Response, next: NextFunction) {
        const { id } = req.user;
        try {
           const response : any = await this.taxInfoUseCase.getMyTaxInfo(id)
        this.invoke(response,200,res,"", next)
          
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async createMyTaxInfo(req: Request, res: Response, next: NextFunction) {
        const { _id } = req.user;
        const { values } = req.body                           
        try {
            const response = await this.taxInfoUseCase.createTaxInfo(_id, values);
            this.invoke(response, 200, res, 'Se gurado la direccion fiscal', next)                                        
        } catch (error) {
            console.log(error);            
            next(new ErrorHandler((error as Error).message || 'Hubo un error al crear', 500));
        }
    }

    public async updateOneTaxInfo(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { values } = req.body
        try {
            const response = await this.taxInfoUseCase.updateTaxInfo(id, {...values})
            this.invoke(response, 200, res, 'Se actualizó correctamente', next)
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async updateMyTaxInfo(req: Request, res: Response, next: NextFunction) {
        const { id } = req.user;
        const { values } = req.body
        try {
            const response = this.taxInfoUseCase.updateTaxInfo(id, values);           
            this.invoke(response, 200, res, 'Se actualizó correctamente', next)                      
        } catch (error) {
            console.log(error, "actualizar");            
            next(new ErrorHandler((error as Error).message || 'Hubo un error al consultar la información', 500));
        }
    }


    public async deleteTaxInfo(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.taxInfoUseCase.deleteTaxInfo(id);
            this.invoke(response, 200, res, 'Se eliminó correctamente', next)
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createInvoice(req: Request, res: Response, next: NextFunction){
        const { customer, payment_form, payment_method, items, order_id, email } = req.body        
        try{                  
            const order : any | null = await this.productOrderUseCase.getOneProductOrder(order_id);     
            if(order.invoice_id) return next(new ErrorHandler('Ya existe una factura para este pedido', 400));              
            const use = "G01";           
            let invoice = await this.facturapiService.createInvoice(customer, items, payment_form, payment_method, use);                                                      
            if(invoice){
                await this.productOrderUseCase.updateProductOrder(order_id, { invoice_id : invoice.id, required_invoice : true });
            }
            if(email){      
                await this.facturapiService.sendInvoiceByEmail(invoice.id, email);          
            }
            this.invoke(invoice, 200, res, 'Factura creada', next);
        }catch(error){
            next(new ErrorHandler((error as Error).message || 'Error al crear la factura', 500));            
        }
    }    

    public async downloadInvoice(req: Request, res: Response, next: NextFunction){
        const { invoice_id } = req.body
        try{
            if(!invoice_id) return next(new ErrorHandler('id de factura requerido', 404));           
            const zipStream: any | null = await this.facturapiService.downloadZipStreamInvoice(invoice_id);
            if (!zipStream) return next(new ErrorHandler('Factura no encontrada', 404));            
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename="factura-${invoice_id}.zip"`);
            zipStream.pipe(res);                      
        }catch(error){                        
            next(new ErrorHandler((error as Error).message || 'Error al descargar la factura', 500));   
        }
    }

    public async createGlobalInvoice(req: Request, res: Response, next: NextFunction){
        const { order_id } = req.body
        try{            
            const order: any | null = await this.productOrderUseCase.getOneProductOrder(order_id);
            // const payment_form = order?.paymentType === "";  
            const payment_form = "";          
            const use = "S01"
            const globalCustomer = {
                legal_name: "PÚBLICO EN GENERAL",
                tax_id: "XAXX010101000",
                tax_system : "616"
            }            
            const facturapiItems = order.products.map((item: any) => {
                const parsedProduct = {
                    product: {
                        description: item?.item?.name,
                        product_key: item?.item?.product_key,
                        price: item?.variant ? item?.variant?.price : item?.item?.price,     
                        sku: item?.variant ? item?.item?.sku : item?.item?.sku,
                        taxes: [ { type: 'IVA', rate: 0.16 } ]
                    },
                    quantity: item?.quantity
                }
                return parsedProduct;
            });

            if(order?.typeDelivery === "homedelivery"){
                facturapiItems.push(
                    { 
                        product: {
                            description: "costo de envio",
                            product_key: "78102200",
                            price: order?.shipping_cost,
                            taxes: [ { type: 'IVA', rate: 0.16 } ]
                       }
                    })
            }
            const response = await this.facturapiService.createInvoice(globalCustomer, facturapiItems, payment_form, use);
            this.invoke(response, 200, res, 'Factura global creada', next);            
        }catch(error){
            next(new ErrorHandler('Error al crear la factura', 500));
        }
    }

}