import { Request, Response, NextFunction, response } from 'express';
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { WarehouseUseCase } from '../../../application/warehouse/WarehouseUseCase';
import { buildReportSectionPDF } from '../../../../libs/pdfPrintSection';
import mongoose from 'mongoose';
import { StoreHouseUseCase } from '../../../application/storehouse/storeHouseUseCase';
import CounterService from '../../../utils/CounterService';
import { generateRandomCode, RandomCodeShipping } from '../../../../shared/infrastructure/validation/Utils';
export class WarehouseController extends ResponseData {
    protected path = '/warehouse'

    constructor(private warehouseUseCase: WarehouseUseCase, private storeHouseUseCase: StoreHouseUseCase) {
        super();
        this.getAisle = this.getAisle.bind(this);
        this.getSection = this.getSection.bind(this);
        this.getAllZones = this.getAllZones.bind(this);
        this.getAllAisles = this.getAllAisles.bind(this);
        this.getAllSections = this.getAllSections.bind(this);
        this.searchProductSection = this.searchProductSection.bind(this);
        this.PrintPdfSection = this.PrintPdfSection.bind(this);
        this.createZone = this.createZone.bind(this);
        this.createAisle = this.createAisle.bind(this);
        this.createSection = this.createSection.bind(this);
        this.addMultipleAisles = this.addMultipleAisles.bind(this);
        this.addMultipleSections = this.addMultipleSections.bind(this);
        this.addMultipleProductsToSection = this.addMultipleProductsToSection.bind(this);
        this.addSingleProductToSection = this.addSingleProductToSection.bind(this);
        this.updateAddStockProduct = this.updateAddStockProduct.bind(this)
        this.updateZone = this.updateZone.bind(this)
        this.updateAisle = this.updateAisle.bind(this);
        this.updateSection = this.updateSection.bind(this);
        this.deleteZone = this.deleteZone.bind(this)
        this.deleteAisle = this.deleteAisle.bind(this);
        this.deleteSection = this.deleteSection.bind(this);

    }

    public async getAllZones(req: Request, res: Response, next: NextFunction) {
        const user = req.user;
        let response;
    
        try {
            if (user.type_user?.role.includes("SUPER-ADMIN") || user.type_user?.role.includes("ADMIN")) {
                response = await this.warehouseUseCase.getAllZones();
                return this.invoke(response, 200, res, '', next);
            }
            
            if (user.type_user?.role.includes("ADMIN") || user.type_user?.role.includes("WAREHOUSE-MANAGER")) {
                response = await this.warehouseUseCase.getAllZonesByStorehouse(user.employee_detail?.store_house?._id);
                return this.invoke(response, 200, res, '', next);
            }
    
            // Si no tiene los permisos necesarios
            return next(new ErrorHandler('No tienes permisos para acceder a esta información', 403));
    
        } catch (error) {
            console.error(error);
            return next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    

    public async getAisle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.warehouseUseCase.getOneAisle(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getSection(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.warehouseUseCase.getDetailSection(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async PrintPdfSection(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.warehouseUseCase.getDetailSection(id);
            
            // Configurar headers
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename=section_${id}.pdf`);
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Pragma", "no-cache");
    
            // Crear una promesa para manejar el stream del PDF
            await new Promise((resolve, reject) => {
                const stream = res;
                
                // Manejar errores durante la generación del PDF
                stream.on('error', (err) => {
                    console.error('Stream error:', err);
                    reject(err);
                });
    
                buildReportSectionPDF(
                    response,
                    (chunk: any) => {
                        try {
                            stream.write(chunk);
                        } catch (err) {
                            console.error('Write error:', err);
                            reject(err);
                        }
                    },
                    () => {
                        try {
                            stream.end();
                            resolve(true);
                        } catch (err) {
                            console.error('End error:', err);
                            reject(err);
                        }
                    }
                );
            });
    
        } catch (error) {
            console.error('Error generating PDF:', error);
            
            // Si la respuesta no ha sido enviada aún
            if (!res.headersSent) {
                // Cancelar la respuesta chunked
                res.removeHeader('Transfer-Encoding');
                res.removeHeader('Content-Type');
                
                next(new ErrorHandler('Hubo un error al generar el PDF', 500));
            } else {
                // Si ya se enviaron headers, solo loguear el error
                console.error('Error after headers sent:', error);
                // Forzar cierre de la conexión
                res.socket?.end();
            }
        }
    }

    public async searchProductSection(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.warehouseUseCase.searchProductInSection(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getAllAisles(req: Request, res: Response, next: NextFunction) {
        const user = req.user;
        let response;
        try {
            if (user.type_user?.role.includes("SUPER-ADMIN")|| user.type_user?.role.includes("ADMIN")) {
                response = await this.warehouseUseCase.getAllAisles();
                return this.invoke(response, 200, res, '', next);
            }
            
            if ( user.type_user?.role.includes("WAREHOUSE-MANAGER")) {
                response = await this.warehouseUseCase.getAllAislesByStorehouse(user.employee_detail?.store_house?._id);
                return this.invoke(response, 200, res, '', next);
            }
    
            // Si no tiene los permisos necesarios
            return next(new ErrorHandler('No tienes permisos para acceder a esta información', 403));
    
        } catch (error) {
            console.error(error);
            return next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getAllSections(req: Request, res: Response, next: NextFunction) {
        const user = req.user;
        let response;
        try {
            if (user.type_user?.role.includes("SUPER-ADMIN") || user.type_user?.role.includes("ADMIN") ) {
                response = await this.warehouseUseCase.getAllSections();
                return this.invoke(response, 200, res, '', next);
            }
            
            if (user.type_user?.role.includes("WAREHOUSE-MANAGER")) {
                response = await this.warehouseUseCase.getAllSectionsByStorehouse(user.employee_detail?.store_house?._id);
                return this.invoke(response, 200, res, '', next);
            }
    
            // Si no tiene los permisos necesarios
            return next(new ErrorHandler('No tienes permisos para acceder a esta información', 403));
    
        } catch (error) {
            console.error(error);
            return next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createZone(req: Request, res: Response, next: NextFunction) {
        const body = req.body
        try {
            const response = await this.warehouseUseCase.crateZone(body)
            if (response instanceof ErrorHandler) {
                return next(response);
            }
            const storehouse = await this.warehouseUseCase.getOneZone(response?._id)
            this.invoke(storehouse, 200, res, 'La zona se creó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al crear', 500));
        }
    }
    public async updateZone(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const body = req.body
        try {
            const response = await this.warehouseUseCase.updateZone(id, body)
            if (response instanceof ErrorHandler) {
                return next(response);
            }
            const zone = await this.warehouseUseCase.getOneZone(response?._id)
            this.invoke(zone, 200, res, 'La zona se editó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al crear', 500));
        }
    }
    public async updateAisle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const body = req.body
        try {
            const response = await this.warehouseUseCase.updateOneAisle(id, body)
            if (response instanceof ErrorHandler) {
                return next(response);
            }
            const aisle = await this.warehouseUseCase.getOneAisleAdd(response?._id)
            this.invoke(aisle, 200, res, 'El pasillo se editó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al crear', 500));
        }
    }

    public async updateSection(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const body = req.body
        try {
            const response = await this.warehouseUseCase.updateOneSection(id, body)
            this.invoke(response, 200, res, 'Sección editada con éxito', next);
        } catch (error) {
            next(error)
        }
    }

    public async createAisle(req: Request, res: Response, next: NextFunction) {
        const body = req.body
        try {
            const response = await this.warehouseUseCase.createAisle(body)
            if (response instanceof ErrorHandler) {
                return next(response);
            }
            const aisle = await this.warehouseUseCase.getOneAisleAdd(response?._id)
            this.invoke(aisle, 200, res, 'El pasillo se creó con éxito', next);
        } catch (error) {
            next(error)
        }
    }

    public async createSection(req: Request, res: Response, next: NextFunction) {
        const { name, aisle } = req.body
        try {
            const infoAisle = await this.warehouseUseCase.getOneAisle(aisle)
            const response = await this.warehouseUseCase.createSection({ name: name, aisle: aisle, storehouse: infoAisle?.storehouse })
            this.invoke(response, 200, res, 'Sección se creada con éxito', next);
        } catch (error) {
            next(error)
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

    public async addSingleProductToSection(req: Request, res: Response, next: NextFunction) {
        const { section, product, quantity } = req.body;
        try {
            // Determinar si es un producto único o una variante
            const isUniqueProduct = product.product_id === null;    
            const type = isUniqueProduct ? "unique_product" : "variant_product";
            
            // Validar la sección
            const valsection = await this.warehouseUseCase.getOneSection(section);
            if (!valsection) {
                return next(new ErrorHandler('La sección no existe', 400));
            }
            
            // Buscar si el producto ya existe en alguna ubicación
            // Si es producto único, buscar por el ID del producto
            // Si es variante, buscar por el ID del producto base y la variante específica
            const productIdToSearch = isUniqueProduct ? product._id : product.product_id;
            const variantIdToSearch = isUniqueProduct ? null : product._id;
            
            const location = await this.warehouseUseCase.searchProductInLocationProduct(
                productIdToSearch, 
                variantIdToSearch
            );
            
            if (location) {
                return next(new ErrorHandler(`El producto ya existe en la ubicación: ${location.name}`, 400));
            }
            
            // Generar código para la nueva ubicación
            const nextCode = await CounterService.getNextSequence(valsection.name);
            const nameLocation = `${valsection.aisle.name}_${valsection.name}_${nextCode}`;
            
            // Crear el objeto de ubicación con la lógica correcta:
            // - product: siempre contiene el ID del producto base
            // - variant: contiene el ID de la variante (o null si es producto único)
            const newPL = {
                product: isUniqueProduct ? product._id : product.product_id,
                variant: isUniqueProduct ? null : product._id,
                quantity: quantity,
                type: type,
                name: nameLocation,
                section: section,
                aisle: valsection.aisle?._id,
                zone: valsection.aisle?.zone?._id,
            };
            
            const add = await this.warehouseUseCase.addProductToLocation(newPL);
            this.invoke(add, 200, res, 'Se agregó con éxito', next);
        } catch (error) {
            console.error(error);
            if (error instanceof ErrorHandler) {
                return next(error);
            }
            next(new ErrorHandler('Hubo un error al agregar el producto', 500));
        }
    }

    public async updateAddStockProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { location, quantity } = req.body;
            let newQuantity = 0
            // Obtener la sección
            const myLocation = await this.warehouseUseCase.getOneLocationProduct(location)
            if (!myLocation) return res.status(404).json({ message: "Ubicación no encontrada" });
            // Buscar el producto en el stockx
            const oldQuantity = myLocation.quantity;
             newQuantity = oldQuantity + quantity;
            const updatedStock = await this.warehouseUseCase.updateOneLocationProduct(location, { quantity: newQuantity });
            if (updatedStock instanceof ErrorHandler) {
                return next(updatedStock);
            }
            this.invoke(response, 200, res, 'Se actualizo el stock con éxito', next);
        } catch (error) {
            console.error(error);
            next(error);
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
                        if (Array.isArray(noRepeat) && noRepeat.length > 0) {
                            throw {
                                product: product.product,
                                message: `El producto ${noRepeat[0].productDetails[index].name} ya está en la sección ${noRepeat[0].name}`
                            };
                        }
                    } else if (product.type === "variant_product") {
                        const noRepeat: any = await this.warehouseUseCase.getVariantInSection(product.variant);
                        console.log(noRepeat);

                        if (Array.isArray(noRepeat) && noRepeat.length > 0) {
                            throw {
                                variant: product.variant,
                                message: `El producto ${noRepeat[0].productDetails[index].name} ya está en la sección ${noRepeat[0].name}`
                            };
                        }
                    }
                })
            );
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
            

            // 🔹 Concatenar productos sin sobrescribir el stock existente, evitando duplicados
            const updatedStock = Array.from(
                new Map([ ...validProducts].map(p => [p.product || p.variant, p])).values()
            );

            // 🔹 Guardar los productos en la sección solo si TODAS las validaciones pasaron
            const responses = await this.warehouseUseCase.addProductsToSection(section, updatedStock);

            this.invoke(responses, 200, res, 'Los productos se agregaron con éxito a la sección', next);
        } catch (error) {
            next(error);
        }
    }



    public async deleteZone(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.warehouseUseCase.deleteOneZone(id)
            this.invoke(response, 200, res, 'La zona se eliminó con éxito', next);
        } catch (error) {
            next(error);
        }
    }
    public async deleteAisle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.warehouseUseCase.deleteOneAisle(id)
            this.invoke(response, 200, res, 'El pasillo se eliminó con éxito', next);
        } catch (error) {
            next(error);
        }
    }

    public async deleteSection(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.warehouseUseCase.deleteOneSection(id)
            this.invoke(response, 200, res, 'La sección se eliminó con éxito', next);
        } catch (error) {
            next(error);
        }
    }




}