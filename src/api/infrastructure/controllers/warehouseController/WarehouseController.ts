import { Request, Response, NextFunction } from 'express';
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { WarehouseUseCase } from '../../../application/warehouse/WarehouseUseCase';
import { promises } from 'nodemailer/lib/xoauth2';
import { log } from 'console';
import { relativeTimeThreshold } from 'moment';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';

export class WarehouseController extends ResponseData {
    protected path = '/warehouse'

    constructor(private warehouseUseCase: WarehouseUseCase, private stockStoreHouseUseCase: StockStoreHouseUseCase) {
        super();
        this.getAisle = this.getAisle.bind(this);
        this.getAllZones = this.getAllZones.bind(this);
        this.getAllAisles = this.getAllAisles.bind(this);
        this.getAllSections = this.getAllSections.bind(this);
        this.createZone = this.createZone.bind(this);
        this.createAisle = this.createAisle.bind(this);
        this.addMultipleAisles = this.addMultipleAisles.bind(this);
        this.addMultipleSections = this.addMultipleSections.bind(this);
        this.addMultipleProductsToSection = this.addMultipleProductsToSection.bind(this);
    }

    public async getAllZones(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.warehouseUseCase.getAllZones()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getAisle(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        try {
            const response = await this.warehouseUseCase.getOneAisle(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getAllAisles(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.warehouseUseCase.getAllAisles()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getAllSections(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.warehouseUseCase.getAllSections()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createZone(req: Request, res: Response, next: NextFunction) {
        const body = req.body
        try {
            const response = await this.warehouseUseCase.crateZone(body)
            this.invoke(response, 200, res, 'La zona se creó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al crear', 500));
        }
    }

    public async createAisle(req: Request, res: Response, next: NextFunction) {
        const body = req.body
        try {
            const response = await this.warehouseUseCase.createAisle(body)
            this.invoke(response, 200, res, 'La zona se creó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async addMultipleAisles(req: Request, res: Response, next: NextFunction) {
        const { names, zone, storehouse } = req.body;    
        try {
            const responses = await Promise.all(
                names.map((name: any) => this.warehouseUseCase.createAisle({ name, zone, storehouse }))
            );
            this.invoke(responses, 200, res, 'Los pasillos se crearon con éxito', next);
        } catch (error) {
           next(error)
        }
    }

    public async addMultipleSections(req: Request, res: Response, next: NextFunction) {
        const { names, aisle_id } = req.body
        try {
            const aisle = await this.warehouseUseCase.getOneAisle(aisle_id)
            const responses = await Promise.all(
                names.map((name: any) => this.warehouseUseCase.createSection({ name: `${aisle?.name}_${name}`, aisle: aisle_id, storehouse: aisle?.storehouse }))
            );
            this.invoke(responses, 200, res, 'Las secciones se crearon con éxito', next);
        } catch (error) {
           next(error)
        }
    }

    public async addMultipleProductsToSection(req: Request, res: Response, next: NextFunction) {
        const { section, products } = req.body;
    
        try {
            // 🔹 Ejecutar todas las validaciones en paralelo
            const validationResults = await Promise.allSettled(
                products.map(async (product: any, index: any) => {
                    if (product.type === "unique_product") {
                        const noRepeat: any = await this.warehouseUseCase.getProductInSection(product.product);
                        console.log(noRepeat[0].productDetails[index].name,`${index}`);
                        
                        if (Array.isArray(noRepeat) && noRepeat.length > 0) {
                            throw {
                                product: product.product,
                                message: `El producto ${noRepeat[0].productDetails[index].name} ya está en la sección ${noRepeat[0].name}`
                            };
                        }
                    } else if (product.type === "variant_product") {
                        const noRepeat: any = await this.warehouseUseCase.getVariantInSection(product.variant);
                        if (Array.isArray(noRepeat) && noRepeat.length > 0) {
                            throw {
                                variant: product.variant,
                                message: `El producto ${noRepeat[0].productDetails[index].name} ya está en la sección ${noRepeat[0].name}`
                            };
                        }
                    }
                })
            );

            console.log(validationResults,'validaciones');
            
    
            // 🔹 Filtrar errores y éxitos por separado
            const errors = validationResults
                .filter(result => result.status === 'rejected')
                .map(result => (result as PromiseRejectedResult).reason);
    
            const validProducts = validationResults
                .filter(result => result.status === 'fulfilled')
                .map((result, index) => products[index]); // Obtener los productos válidos
    
            // 🔹 Si hay errores, devolverlos y NO agregar nada
            if (errors.length > 0) {
                return res.status(400).json({
                    message: 'Algunos productos no pasaron la validación',
                    errors
                });
            }
    
            // 🔹 Obtener stock existente en la sección
            const existStock = await this.warehouseUseCase.getOneSection(section);
            const stockExist = existStock?.stock || [];
    
            // 🔹 Concatenar productos sin sobrescribir el stock existente, evitando duplicados
            const updatedStock = Array.from(
                new Map([...stockExist, ...validProducts].map(p => [p.product || p.variant, p])).values()
            );
    
            // 🔹 Guardar los productos en la sección solo si TODAS las validaciones pasaron
            const responses = await this.warehouseUseCase.addProductsToSection(section, updatedStock);
    
            this.invoke(responses, 200, res, 'Los productos se agregaron con éxito a la sección', next);
        } catch (error) {
            next(error);
        }
    }
    
    

    public async addProductToSection(req: Request, res: Response, next: NextFunction) {
        const { section, product } = req.body;
    
        try {
           
    
            // Obtener stock existente en la sección
            const existStock = await this.warehouseUseCase.getOneSection(section);
            const stockExist = existStock?.stock || [];
    
            // 🔹 Concatenar productos sin sobrescribir el stock existente
            const updatedStock = [...stockExist, ...product];
    
            // 🔹 Guardar el nuevo stock en la sección
            const responses = await this.warehouseUseCase.addProductsToSection(section, updatedStock);
    
            this.invoke(responses, 200, res, 'Los productos se agregaron con éxito a la sección', next);
        } catch (error) {
            next(error);
        }
    }
    
    
    
   

}