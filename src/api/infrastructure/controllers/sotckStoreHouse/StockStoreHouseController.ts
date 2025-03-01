import { Request, Response, NextFunction, response } from 'express';
import * as convert from 'xml-js';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase'
import { StockSHinputUseCase } from '../../../application/storehouse/stockSHinputUseCase'
import { StockSHoutputUseCase } from '../../../application/storehouse/stockSHoutputUseCase'
import { StockSHreturnUseCase } from '../../../application/storehouse/stockSHreturnUseCase'


import { PopulateProductCS, stockBranchPopulateConfig } from '../../../../shared/domain/PopulateInterfaces';
import { RandomCodeId } from '../../../../shared/infrastructure/validation/Utils';
import { ProductUseCase } from '../../../application/product/productUseCase';
import { mongo } from 'mongoose';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { buildPDF } from '../../../../libs/pdfKit';
import { buildInputsReportPDF } from '../../../../libs/pdfPrintReport';
import moment from 'moment';


export class StockStoreHouseController extends ResponseData {
    protected path = '/stock-StoreHouse';

    constructor(
        private stockStoreHouseUseCase: StockStoreHouseUseCase,
        private stockSHinputUseCase: StockSHinputUseCase,
        private stockSHoutputUseCase: StockSHoutputUseCase,
        private stockSHreturnUseCase: StockSHreturnUseCase,
        private productUseCase: ProductUseCase,
        private s3Service: S3Service,
    ) {
        super();
        this.getAllStock = this.getAllStock.bind(this);
        this.getAllInputs = this.getAllInputs.bind(this)
        this.getAllOutputs = this.getAllOutputs.bind(this)
        this.getAllMovements = this.getAllMovements.bind(this)
        this.getAllInputsPending = this.getAllInputsPending.bind(this)
        this.getAllInputsPendingByFolio = this.getAllInputsPendingByFolio.bind(this);
        this.getAvailableProducts = this.getAvailableProducts.bind(this)
        this.getInputsByFolio = this.getInputsByFolio.bind(this);
        this.createStock = this.createStock.bind(this);
        this.createMultipleStock = this.createMultipleStock.bind(this);
        this.createMultipleOutputs = this.createMultipleOutputs.bind(this);
        this.authorizeInputs = this.authorizeInputs.bind(this);
        this.updateStock = this.updateStock.bind(this);
        this.addStock = this.addStock.bind(this);
        this.removeStock = this.removeStock.bind(this);
        this.returnStock = this.returnStock.bind(this);
        this.getAvailableStock = this.getAvailableStock.bind(this);
        this.getProductsEntries = this.getProductsEntries.bind(this);
        this.getProductsOutputs = this.getProductsOutputs.bind(this);
        this.seedProductStock = this.seedProductStock.bind(this);
        this.feedDailyProduct = this.feedDailyProduct.bind(this);
        this.readyToAccommodate = this.readyToAccommodate.bind(this)
        this.PrintReportInputsByFolio = this.PrintReportInputsByFolio.bind(this);

    }

    public async getAllStock(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.stockStoreHouseUseCase.getStock('662fe69b9ba1d8b3cfcd3634')
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }

        next(new ErrorHandler('No tiene los permisos necesarios', 500));
    }

    public async getAllInputs(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.stockSHinputUseCase.getInputs()

            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getAllInputsPending(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.stockSHinputUseCase.getAllInputsPending()

            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getAllInputsPendingByFolio(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.stockSHinputUseCase.getAllInputsByFolio()
        
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async readyToAccommodate(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.stockSHinputUseCase.startReadyToAccommodate()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getInputsByFolio(req: Request, res: Response, next: NextFunction) {
        const { folio } = req.params
        try {
            const response = await this.stockSHinputUseCase.getInputsByFolio(folio)

            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async PrintReportInputsByFolio(req: Request, res: Response, next: NextFunction) {
        const { folio } = req.params
        try {
            const response = await this.stockSHinputUseCase.getInputsByFolio(folio)
            
            res.writeHead(200, {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename=order${folio}.pdf`
                  });
            
                  const stream = res;
            
                  buildInputsReportPDF(
                    response[0],
                    (data: any) => stream.write(data),
                    () => stream.end()
                  );
            
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getAllOutputs(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.stockSHoutputUseCase.startGetAllOutputs()
            this.invoke(response, 200, res, '', next);
        } catch (error) {

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getAllMovements(req: Request, res: Response, next: NextFunction) {
        try {
            // Ejecutar las consultas en paralelo
            const [allOutputs, allInputs] = await Promise.all([
                this.stockSHoutputUseCase.startGetAllOutputs(),
                this.stockSHinputUseCase.getInputs()
            ]);

            // Añadir el tipo directamente en la combinación de arrays
            const allTransactions = [
                ...allOutputs.map(output => ({ ...output, type: 'output' })),
                ...allInputs.map(input => ({ ...input, type: 'input' }))
            ];


            const sortedTransactions = allTransactions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((item, index) => ({ id: index.toString(), ...item }));


            // Enviar la respuesta
            this.invoke(sortedTransactions, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }


    public async getAvailableStock(req: Request, res: Response, next: NextFunction) {
        const response = await this.stockStoreHouseUseCase.getStock("662fe69b9ba1d8b3cfcd3634")
        this.invoke(response, 200, res, '', next);

    }

    public async getAvailableStockById(req: Request, res: Response, next: NextFunction) {
        const response = await this.stockStoreHouseUseCase.getStock("662fe69b9ba1d8b3cfcd3634")
        this.invoke(response, 200, res, '', next);
    }

    public async getAvailableProducts(req: Request, res: Response, next: NextFunction) {
        const response = await this.stockStoreHouseUseCase.getStock("662fe69b9ba1d8b3cfcd3634")
        this.invoke(response, 200, res, '', next);

    }

    public async createStock(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { product_id, stock } = req.body;
        const user = req.user
        const UserInfo = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            type_user: user.type_user
        }

        try {
            const available = await this.stockStoreHouseUseCase.getProductStock(product_id, id, PopulateProductCS,)

            const available_id = available?._id
            if (!available) {
                const response = await this.stockStoreHouseUseCase.createStock({ product_id: product_id, stock: stock, StoreHouse_id: id })
                const newQuantity = stock
                const entry = await this.stockSHinputUseCase.createInput({ SHStock_id: response?._id, quantity: stock, newQuantity: newQuantity, responsible: UserInfo })
                const allData = await this.stockStoreHouseUseCase.updateStock(response?._id, { stock: entry.newQuantity })

                this.invoke(allData, 201, res, 'Se creó con éxito', next);
            } else {
                next(new ErrorHandler(`Ya exite producto con id:${available_id} `, 500));
            }
        }
        catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al crear', 500));
        }

    }

    public async createMultipleStock(req: Request, res: Response, next: NextFunction) {
        const { products } = req.body;
        const user = req.user;

        if (!Array.isArray(products) || products.length === 0) {
            return next(new ErrorHandler('Faltan datos necesarios o los productos no son válidos', 400));
        }

        if (!user || !user._id || !user.fullname) {
            return next(new ErrorHandler('Información del usuario no disponible', 400));
        }

        const UserInfo = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            type_user: user.type_user,
        };
        const SH_id = '662fe69b9ba1d8b3cfcd3634';
        const code_folio = RandomCodeId('FO');

        try {
            const validateProduct = (product: any): boolean => {
                return (
                    product &&
                    product._id &&
                    product.quantity &&
                    typeof product.quantity === "number" &&
                    product.quantity > 0
                );
            };

            // Validar que todos los productos tengan los campos requeridos
            const invalidProducts = products.filter((product: any) => !validateProduct(product));
            if (invalidProducts.length > 0) {
                return next(
                    new ErrorHandler(
                        `Algunos productos tienen datos faltantes o inválidos: ${JSON.stringify(invalidProducts.map(i => i.name))}`,
                        400
                    )
                );
            }
            const processProduct = async (item: { _id: string; product_id?: string; quantity: number; name: string }, isVariant = false) => {
                const itemQuantity = Number(item.quantity);
                if (isNaN(itemQuantity) || itemQuantity <= 0) {
                    throw new Error(`Cantidad inválida para el producto ${item.name}`);
                }

                const available = isVariant
                    ? await this.stockStoreHouseUseCase.getVariantStock(item._id, SH_id)
                    : await this.stockStoreHouseUseCase.getProductStock(item._id, SH_id);


                    
                const availableStock = Number(available?.stock) || 0;
                if (isNaN(availableStock)) {
                    throw new Error(`El stock disponible no es válido para el producto ${item.name} (ID: ${item._id})`);
                }

                const newQuantity = availableStock + itemQuantity;
            
                const response = available || (isVariant
                    ? await this.stockStoreHouseUseCase.createStock({
                        product_id: item.product_id!,
                        variant_id: item._id,
                        StoreHouse_id: SH_id,
                        stock: 0,
                    })
                    : await this.stockStoreHouseUseCase.createStock({
                        product_id: item._id,
                        StoreHouse_id: SH_id,
                        stock: 0,
                    }));
                   
                    

                await this.stockSHinputUseCase.createInput({
                    SHStock_id: response._id,
                    quantity: itemQuantity,
                    newQuantity,
                    responsible: UserInfo,
                    folio: code_folio,
                    product_detail: item,
                });
               
                
                // await this.stockStoreHouseUseCase.updateStock(response._id, { stock: newQuantity });
            };

            const operations = products.map(async (item) => {
                try {
                    if (item._id && item.product_id) {
                        await processProduct(item, true);
                    } else if (item._id) {
                        await processProduct(item);
                    } else {
                        throw new Error(`Producto sin identificador válido: ${JSON.stringify(item)}`);
                    }
                    
                    
                } catch (error) {
                    console.error(`Error procesando producto ${item._id}:`, error);
                }
            });

            await Promise.allSettled(operations);
            
            this.invoke(code_folio, 200, res, 'Alta de exitosa', next);
        } catch (error) {
            console.error('Error procesando stock:', error);
            next(new ErrorHandler('Hubo un error procesando los productos', 500));
        }
    }




    public async createMultipleOutputs(req: Request, res: Response, next: NextFunction) {
        const { products } = req.body;
        const user = req.user;

        // Validación inicial de `products` y `user`
        if (!products || !Array.isArray(products) || products.length === 0) {
            return next(new ErrorHandler("No se proporcionaron productos válidos", 400));
        }

        // Información del usuario
        const UserInfo = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            type_user: user.type_user,
        };

        const SH_id = "662fe69b9ba1d8b3cfcd3634";
        const code_folio = RandomCodeId("FO");

        try {
            // Helper para validar productos
            const validateProduct = (product: any): boolean => {
                return (
                    product &&
                    product._id &&
                    product.quantity &&
                    typeof product.quantity === "number" &&
                    product.quantity > 0
                );
            };

            // Validar que todos los productos tengan los campos requeridos
            const invalidProducts = products.filter((product: any) => !validateProduct(product));
            if (invalidProducts.length > 0) {
                return next(
                    new ErrorHandler(
                        `Algunos productos tienen datos faltantes o inválidos: ${JSON.stringify(invalidProducts.map(i => i.name))}`,
                        400
                    )
                );
            }

            // Procesar productos válidos
            const processProduct = async (item: any, isVariant: boolean = false) => {
                const itemQuantity = Number(item.quantity);

                // Validar cantidad
                if (isNaN(itemQuantity) || itemQuantity <= 0) {
                    throw new Error(`La cantidad del producto ${item.name || "desconocido"} no es válida`);
                }

                // Obtener detalles de stock
                const stockDetails = await this.stockStoreHouseUseCase.getDetailStock(item.stock_id);

                if (!stockDetails) {
                    throw new Error(`No se encontró stock para el producto ${item.name || item._id}`);
                }

                const availableStock = Number(stockDetails?.stock) || 0;

                if (isNaN(availableStock) || availableStock < itemQuantity) {
                    throw new Error(
                        `Stock insuficiente para el producto ${item.name || "desconocido"}: Disponible (${availableStock}), Requerido (${itemQuantity})`
                    );
                }

                // Calcular el nuevo stock
                const newQuantity = availableStock - itemQuantity;

                // Crear salida de stock
                await this.stockSHoutputUseCase.createOutput({
                    SHStock_id: stockDetails._id,
                    quantity: itemQuantity,
                    newQuantity: newQuantity,
                    responsible: UserInfo,
                    folio: code_folio,
                    product_detail: item,
                });

                // Actualizar stock en el almacén
                await this.stockStoreHouseUseCase.updateStock(item.stock_id, { stock: newQuantity });
            };

            // Procesar todos los productos
            const operations = products.map(async (item: any) => {
                if (validateProduct(item)) {
                    await processProduct(item, true);
                } else {
                    throw new Error("Producto con identificador o datos faltantes");
                }
            });

            await Promise.all(operations);

            // Respuesta exitosa
            this.invoke(code_folio, 200, res, "Baja de stock exitosa", next);
        } catch (error) {
            console.error("Error procesando stock:", error);
            next(new ErrorHandler("Hubo un error procesando los productos", 500));
        }
    }

    public async authorizeInputs(req: Request, res: Response, next: NextFunction) {
        try {
            const { entries } = req.body;
            const user = req.user;
            const nowDate = moment().toISOString();
            const SH_id = "662fe69b9ba1d8b3cfcd3634";
            
            if (!Array.isArray(entries) || entries.length === 0) {
                return next(new ErrorHandler("No se proporcionaron productos válidos", 400));
            }
            
            const UserInfo = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                type_user: user.type_user,
            };
    
            // Procesar y validar datos de entrada
            const parsedData = entries.map(({ _id, SHStock_id, MyQuantity, product_detail, notes }) => ({
                _id,
                SHStock_id,
                MyQuantity: Number(MyQuantity),
                product_detail: {
                    _id: product_detail._id,
                    product_id: product_detail.product_id || null,
                    name: product_detail.name
                },
                notes: notes || ""
            })).filter(({ _id, MyQuantity }) => _id && MyQuantity > 0 && !isNaN(MyQuantity));
    
            if (parsedData.length === 0) {
                return next(new ErrorHandler("Todos los productos tienen datos inválidos", 400));
            }
            
            const processInput = async (item : any, isVariant = false) => {
                const available = isVariant
                    ? await this.stockStoreHouseUseCase.getVariantStock(item.product_detail._id, SH_id)
                    : await this.stockStoreHouseUseCase.getProductStock(item.product_detail._id, SH_id);
    
                const availableStock = Number(available?.stock) || 0;
                const newQuantity = availableStock + item.MyQuantity;
    
                await Promise.all([
                    this.stockSHinputUseCase.updateInputStorehouse(item._id, {
                        in_storehouse: true,
                        notes: item.notes,
                        user_received: UserInfo,
                        newQuantity,
                        date_received: nowDate,
                        quantity_received: item.MyQuantity
                    }),
                    this.stockStoreHouseUseCase.updateStock(available._id, { stock: newQuantity })
                ]);
            };
            
            const operations = parsedData.map(async (item) => {
                try {
                    await processInput(item, Boolean(item.product_detail.product_id));
                } catch (error) {
                    console.error(`Error procesando entrada ${item._id}:`, error);
                }
            });
            
            await Promise.allSettled(operations);
            this.invoke(parsedData, 200, res, 'Alta en almacén exitosa', next);
        } catch (error) {
            console.error("Error procesando stock:", error);
            next(new ErrorHandler("Hubo un error procesando los productos", 500));
        }
    }
    



    public async updateStock(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { stock } = req.body;

        try {
            const response = await this.stockStoreHouseUseCase.updateStock(id, { stock: stock })
            this.invoke(response, 201, res, 'Se actualizó con éxito', next);

        } catch (error) {

            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

    public async addStock(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { stock } = req.body;
        const user = req.user

        const UserInfo = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            type_user: user.type_user
        }

        try {
            const response = await this.stockStoreHouseUseCase.getDetailStock(id)

            if (response) {

                const num1 = response?.stock || 0
                const num2 = parseInt(stock)
                const newQuantity = num1 + num2
                const update = await this.stockSHinputUseCase.createInput({ newQuantity: newQuantity, quantity: stock, SHStock_id: response?._id, responsible: UserInfo })
                const allData = await this.stockStoreHouseUseCase.updateStock(response?._id, { stock: update?.newQuantity })
                this.invoke(allData, 201, res, 'Se actualizó con éxito', next);
            } else {
                next(new ErrorHandler('No hay stock de este producto', 500));
            }

        } catch (error) {

            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

    public async removeStock(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { stock } = req.body;



        try {
            const response = await this.stockStoreHouseUseCase.getDetailStock(id)


            if (response) {
                const num1 = response.stock
                const num2 = parseInt(stock)
                const newQuantity = num1 - num2


                const update = await this.stockSHoutputUseCase.createOutput({ newQuantity: newQuantity, quantity: stock, SHStock_id: response._id })
                const allData = await this.stockStoreHouseUseCase.updateStock(response._id, { stock: update?.newQuantity })
                this.invoke(allData, 201, res, 'Se actualizó con éxito', next);
            } else {
                next(new ErrorHandler('No existe este stock', 500));
            }


        } catch (error) {

            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

    public async returnStock(req: Request, res: Response, next: NextFunction) {
        const { stock, product_id, responsible_id } = req.body;

        try {
            const response = await this.stockStoreHouseUseCase.getProductStock(product_id, stockBranchPopulateConfig)

            const num1 = response.stock
            const num2 = parseInt(stock)
            const newQuantity = num1 + num2


            const update = await this.stockSHreturnUseCase.createReturn({ newQuantity: newQuantity, quantity: stock, SHStock_id: response._id, responsible_id: responsible_id })
            const allData = await this.stockStoreHouseUseCase.updateStock(response._id, { stock: update?.newQuantity })
            this.invoke(allData, 201, res, 'Se actualizó con éxito', next);

        } catch (error) {

            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

    public async deleteStock(req: Request, res: Response, next: NextFunction) {
        const { stock, product_id, responsible_id } = req.body;

        try {
            const response = await this.stockStoreHouseUseCase.getProductStock(product_id, stockBranchPopulateConfig)
            if (response.stock > 0) {
                next(new ErrorHandler('Ahun existen productos en stock', 500));

            }
            else {

                const data = await this.stockStoreHouseUseCase.updateStock(response._id, { status: false })
                this.invoke(data, 201, res, 'Se actualizó con éxito', next);
            }



        } catch (error) {
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

    public getProductsByCategory(req: Request, res: Response, next: NextFunction) {
        const { category } = req.body

    }

    public async getProductsEntries(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.stockStoreHouseUseCase.getAllProductsEntries()
            const response2 = response?.filter((item: any) => item.Inputs.length > 0)
            this.invoke(response2, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }

    }
    public async getProductsOutputs(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.stockStoreHouseUseCase.getAllProductOutputs()
            const response2 = response?.filter((item: any) => item.Outputs.length > 0)
            this.invoke(response2, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async seedProductStock(req: Request, res: Response, next: NextFunction) {
        const user = req.user
        let SH_id = '662fe69b9ba1d8b3cfcd3634'
        let stock = 20
        const code_folio = RandomCodeId('FO');

        try {
            const response = await this.productUseCase.getProducts()

            const allCreatedStock = response.map(async (i) => {
                const addOneStock = await this.stockStoreHouseUseCase.createStock({ product_id: i._id, StoreHouse_id: SH_id, stock: stock })
                const inputs = await this.stockSHinputUseCase.createInput({
                    newQuantity: stock, quantity: stock, SHStock_id: addOneStock?._id, responsible: user._id, folio: code_folio, user_received: user._id,
                    user_delivery: user._id, product_detail: i._id
                })
                return inputs
            })

            this.invoke(allCreatedStock, 201, res, 'Se actualizó con éxito', next);

        } catch (error) {

            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

    public async feedDailyProduct(req: Request, res: Response, next: NextFunction) {
        const SH_id = new mongo.ObjectId('662fe69b9ba1d8b3cfcd3634');

        try {
            const products: any = await this.stockStoreHouseUseCase.dailyFeed(SH_id);

            const response = await Promise.all(
                products.map(async (i: any) => {
                    try {
                        const image = i.image;
                        i.id = i.id.toString()
                        i.image_link = image.startsWith("https://")
                            ? image
                            : await this.s3Service.getUrlObject(image + ".jpeg");
                        i.available = i.stock > 0 ? 'En Stock' : 'Fuera de Stock'
                        i.condition = 'Nuevo'
                        i.price = i.discountPrice ? `${i.discountPrice} MXN` : `${i.price} MXN`
                        i.link = `https://cichmex.mx/productos/${i.id}`
                    } catch (error) {
                        console.log(`Error al obtener la URL de S3 para el producto ${i.id}:`, error);
                        i.image_link = null; // Opcional: asigna `null` o un valor por defecto en caso de error
                    }
                    return i;
                })
            );

            const productsForXML = response.map((product) => {

                return {
                    'g:id': product.id,
                    'g:title': product.title,
                    'g:description': product.description,
                    'g:link': product.link,
                    'g:image_link': product.image_link,
                    'g:condition': product.condition,
                    'g:availability': product.available,
                    'g:price': product.price,
                    'g:brand': product.brand,
                };
            });

            const xmlObject = {
                rss: {
                    _attributes: {
                        version: '2.0',
                        'xmlns:g': 'http://base.google.com/ns/1.0',
                    },
                    channel: {
                        title: 'Cichmex',
                        link: 'https://cichmex.mx/',
                        description: 'Tienda oficial Cichmex',
                        item: productsForXML,
                    },
                },
            };

            const xmlOptions = { compact: true, ignoreComment: true, spaces: 4 };
            const xml = convert.js2xml(xmlObject, xmlOptions);

            return res.type('application/xml').status(200).send(xml);

        } catch (error) {
            console.log('Error en feedDailyProduct:', error);
            next(new ErrorHandler('Hubo un error', 500));
        }
    }


}