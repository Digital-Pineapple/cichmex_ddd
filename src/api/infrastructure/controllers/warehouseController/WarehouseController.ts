import { Request, Response, NextFunction } from 'express';
import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { WarehouseUseCase } from '../../../application/warehouse/WarehouseUseCase';
import { promises } from 'nodemailer/lib/xoauth2';
import { log } from 'console';
import { relativeTimeThreshold } from 'moment';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import { buildInputsReportPDF } from '../../../../libs/pdfPrintReport';
import { buildReportSectionPDF } from '../../../../libs/pdfPrintSection';
import mongoose from 'mongoose';

export class WarehouseController extends ResponseData {
    protected path = '/warehouse'

    constructor(private warehouseUseCase: WarehouseUseCase, private stockStoreHouseUseCase: StockStoreHouseUseCase) {
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
        try {
            const response = await this.warehouseUseCase.getAllZones()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
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
        const { id } = req.params
        try {
            const response = await this.warehouseUseCase.getDetailSection(id)

            res.writeHead(200, {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=order${id}.pdf`
            });

            const stream = res;

            buildReportSectionPDF(
                response,
                (data: any) => stream.write(data),
                () => stream.end()
            );
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
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
    public async updateZone(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const body = req.body
        try {
            const response = await this.warehouseUseCase.updateZone(id, body)
            this.invoke(response, 200, res, 'La zona se editó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al crear', 500));
        }
    }
    public async updateAisle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const body = req.body
        try {
            const response = await this.warehouseUseCase.updateOneAisle(id, body)
            this.invoke(response, 200, res, 'El pasillo se editó con éxito', next);
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
            this.invoke(response, 200, res, 'El pasillo se creó con éxito', next);
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
            const isUniqueProduct = product.product_id === null;
            const valuate = isUniqueProduct ? "unique_product" : "variant_product";
            const exist = await this.warehouseUseCase.getOneSection(section);
            const oldStock = exist?.stock || [];

            const checkExistence = isUniqueProduct
                ? this.warehouseUseCase.getProductInSection
                : this.warehouseUseCase.getVariantInSection;

            const noRepeat = await checkExistence.call(this.warehouseUseCase, product._id);
            if (Array.isArray(noRepeat) && noRepeat.length > 0) {
                return next(new ErrorHandler(`El producto se encuentra en la sección: ${noRepeat[0].name}`, 400));
            }

            const newStock = {
                [isUniqueProduct ? 'product' : 'variant']: product._id,
                quantity: quantity,
                type: valuate
            };

            const updatedStock = [newStock, ...oldStock];
            const updated = await this.warehouseUseCase.updateOneSection(section, { stock: updatedStock });

            this.invoke(updated, 200, res, 'Se agregó con éxito', next);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    public async updateAddStockProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { section, product, quantity } = req.body;
            // Obtener la sección
            const mySection = await this.warehouseUseCase.getOneSection(section);
            if (!mySection) return res.status(404).json({ message: "Sección no encontrada" });

            let updatedStock = mySection.stock || [];
            const productKey = product.type === "unique_product" ? "product" : "variant";
            const ObjectId = new mongoose.Types.ObjectId(product._id)
            // Buscar el producto en el stock
            const stockItem = updatedStock.find((item: any) => item[productKey]?.equals(ObjectId));



            if (!stockItem) return next(new ErrorHandler('El producto no existe en esta sección', 400));

            const newQuantity = (stockItem.quantity ?? 0) + (quantity ?? 0);

            if (newQuantity < 0) {
                return next(new ErrorHandler(`Stock en sección: ${stockItem.quantity}`, 400));
            }

            // Si la cantidad es válida, actualizar el stock
            stockItem.quantity = newQuantity;


            // Actualizar la sección con el nuevo stock
            const response = await this.warehouseUseCase.updateOneSection(section, { stock: updatedStock });

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