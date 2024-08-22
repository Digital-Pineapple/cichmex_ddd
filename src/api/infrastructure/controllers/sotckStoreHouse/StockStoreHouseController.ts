import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase'
import { StockSHinputUseCase } from '../../../application/storehouse/stockSHinputUseCase'
import { StockSHoutputUseCase } from '../../../application/storehouse/stockSHoutputUseCase'
import { StockSHreturnUseCase } from '../../../application/storehouse/stockSHreturnUseCase'


import { PopulateProductCS, stockBranchPopulateConfig } from '../../../../shared/domain/PopulateInterfaces';
import { RandomCodeId } from '../../../../shared/infrastructure/validation/Utils';


export class StockStoreHouseController extends ResponseData {
    protected path = '/stock-StoreHouse';

    constructor(
        private stockStoreHouseUseCase: StockStoreHouseUseCase,
        private stockSHinputUseCase: StockSHinputUseCase,
        private stockSHoutputUseCase: StockSHoutputUseCase,
        private stockSHreturnUseCase: StockSHreturnUseCase,
    ) {
        super();
        this.getAllStock = this.getAllStock.bind(this);
        this.getAllInputs = this.getAllInputs.bind(this)
        this.getAllOutputs = this.getAllOutputs.bind(this)
        this.getAvailableProducts = this.getAvailableProducts.bind(this)
        this.createStock = this.createStock.bind(this);
        this.createMultipleStock = this.createMultipleStock.bind(this);
        this.createMultipleOutputs = this.createMultipleOutputs.bind(this);
        this.updateStock = this.updateStock.bind(this);
        this.addStock = this.addStock.bind(this);
        this.removeStock = this.removeStock.bind(this);
        this.returnStock = this.returnStock.bind(this);
        this.getAvailableStock = this.getAvailableStock.bind(this);
        this.getProductsEntries = this.getProductsEntries.bind(this);
        this.getProductsOutputs = this.getProductsOutputs.bind(this);

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
        const { user_received, user_delivery, products } = req.body;
        const user = req.user;
        const UserInfo = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            type_user: user.type_user
        };
        const SH_id = '662fe69b9ba1d8b3cfcd3634';
        const code_folio = RandomCodeId('FO');
    
        try {
            const operations = products.map(async (item: any) => {
                const available = await this.stockStoreHouseUseCase.getProductStock(item._id, SH_id);
                const available_id = available?._id;
                
    
                if (!available) {
                    const response = await this.stockStoreHouseUseCase.createStock({ product_id: item._id, StoreHouse_id: SH_id });
                    const newQuantity = item.quantity;
                    const entry = await this.stockSHinputUseCase.createInput({
                        SHStock_id: response?._id,
                        quantity: item.quantity,
                        newQuantity: newQuantity,
                        responsible: UserInfo,
                        folio: code_folio,
                        product_detail: item,
                        user_received:user_received,
                        user_delivery:user_delivery
                    });
                    await this.stockStoreHouseUseCase.updateStock(response?._id, { stock: entry.newQuantity });
                } else {
                    const newQuantity = item.quantity + available.stock;
                    const entry = await this.stockSHinputUseCase.createInput({
                        SHStock_id: available?._id,
                        quantity: item.quantity,
                        newQuantity: newQuantity,
                        responsible: UserInfo,
                        folio: code_folio,
                        product_detail: item,
                        user_received:user_received,
                        user_delivery:user_delivery
                    });
                    await this.stockStoreHouseUseCase.updateStock(available_id, { stock: entry.newQuantity });
                }
            });
    
            await Promise.all(operations);
            this.invoke(code_folio, 200, res, 'Alta de stock exitosa', next);
        } catch (error) {
            console.error(error);
            next(new ErrorHandler('Hubo un error', 500));
        }
    }

    public async createMultipleOutputs(req: Request, res: Response, next: NextFunction) {
        const { user_received, user_delivery, products } = req.body;
        const user = req.user;
        const UserInfo = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            type_user: user.type_user
        };
        
        const SH_id = '662fe69b9ba1d8b3cfcd3634';
        const code_folio = RandomCodeId('FO');
    
        try {
            const operations = products.map(async (item: any) => {
                const available = await this.stockStoreHouseUseCase.getProductStock(item._id, SH_id);
                const available_id = available?._id;
    
                if (!available) {
                    return(new ErrorHandler(`Producto: ${item.name} no disponible`,500))
                } else {
                    const newQuantity = available.stock - item.quantity ;
                    const output = await this.stockSHoutputUseCase.createOutput({
                        SHStock_id: available?._id,
                        quantity: item.quantity,
                        newQuantity: newQuantity,
                        responsible: UserInfo,
                        folio: code_folio,
                        product_detail: item,
                        user_received:user_received,
                        user_delivery:user_delivery
                    });
                    await this.stockStoreHouseUseCase.updateStock(available_id, { stock: output.newQuantity });
                }
            });
            await Promise.all(operations);
            this.invoke(code_folio, 200, res, 'Salida exitosa', next);
        } catch (error) {
            console.error(error);
            next(new ErrorHandler('Hubo un error', 500));
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

}