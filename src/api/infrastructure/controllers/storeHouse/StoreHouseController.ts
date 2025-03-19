import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';


import { PopulateProductCS, stockBranchPopulateConfig } from '../../../../shared/domain/PopulateInterfaces';
import { StoreHouseUseCase } from '../../../application/storehouse/storeHouseUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import { log } from 'console';
import mongoose from 'mongoose';


export class StoreHouseController extends ResponseData {
    protected path = '/storeHouse';

    constructor(
        private storeHouseUseCase: StoreHouseUseCase,
        private stockStoreHouseUseCase: StockStoreHouseUseCase,
        private s3Service: S3Service,
    ) {
        super();
        this.getAllStoreHouses = this.getAllStoreHouses.bind(this);
        this.updateStoreHouse = this.updateStoreHouse.bind(this);
        this.createStoreHouse = this.createStoreHouse.bind(this);
        this.deleteStoreHouse = this.deleteStoreHouse.bind(this);
        this.getOneStoreHouse = this.getOneStoreHouse.bind(this);

    }

    public async getAllStoreHouses(req: Request, res: Response, next: NextFunction) {
        const user = req.user
        const typeUser = user.type_user?.role
        const storehouseUser = user?.employee_detail?.store_house?._id
        let response : any = []
        try {
            const getStorehouses = await this.storeHouseUseCase.getStoreHouses()
            if (
                (getStorehouses && typeUser?.includes('WAREHOUSEMAN') || typeUser?.includes("WAREHOUSE-MANAGER")) &&
                !(getStorehouses instanceof ErrorHandler)
              ) {
                response = getStorehouses?.filter((i: any) => i._id.toString() === storehouseUser );
              }else{
                response = getStorehouses
              }
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getOneStoreHouse(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response = await this.storeHouseUseCase.getDetailStoreHouse(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createStoreHouse(req: Request, res: Response, next: NextFunction) {
        const { name, description, phone_number, location, tag } = req.body;
        const user = req.user


        try {
            const user_id = user.id
            const location1 = JSON.parse(location);
            let imageUrls: {}[] = [];
            if (req.files) {
                // Cast req.files to a more specific type if you know what kind of files are being handled
                const files = req.files as Express.Multer.File[];

                // Upload files to S3 and collect URLs
                await Promise.all(files.map(async (file, index) => {
                    const pathObject = `${this.path}/${name}/${Date.now()}.webp`;
                    const { url, success } = await this.s3Service.uploadToS3AndGetUrl(
                        `${pathObject}`,
                        file,
                        'image/*'
                    );

                    if (!success) {
                        throw new ErrorHandler('Hubo un error al subir la imagen', 400);
                    }
                    imageUrls.push({ url: url.split('?')[0] });
                }));
            }

            const response: any = await this.storeHouseUseCase.createStoreHouse(
                {
                    user_id,
                    name,
                    description,
                    phone_number,
                    location: location1,
                    images: imageUrls,
                    status: true,
                    tag: tag ?? null
                },
            );
            this.invoke(response, 200, res, '', next);
        }
        catch (error) {
            next(new ErrorHandler('Hubo un error al crear', 500));
        }

    }
    public async updateStoreHouse(req: Request, res: Response, next: NextFunction) {
        const { name, description, phone_number, location, tag } = req.body;
        const user = req.user
        const { id } = req.params


        try {
            const user_id = user.id
            const location1 = JSON.parse(location);
            const response: any = await this.storeHouseUseCase.updateStoreHouse(id,
                {
                    user_id,
                    name,
                    description,
                    phone_number,
                    location: location1,
                    status: true,
                    tag: tag ?? null
                },
            );
            this.invoke(response, 200, res, 'Se editó con éxito', next);
        }
        catch (error) {
            next(new ErrorHandler('Hubo un error al editar', 500));
        }


    }

    public async deleteStoreHouse(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!id) {
            return next(new ErrorHandler('ID de almacén no proporcionado', 400));
        }

        try {
            const stockList = await this.stockStoreHouseUseCase.getStock(id);

            if (Array.isArray(stockList) && stockList.length > 0) {
                return next(new ErrorHandler('Stock existente, elimine el stock de este almacén', 400));
            }

            const response = await this.storeHouseUseCase.updateStoreHouse(id, { status: false });

            return this.invoke(response, 200, res, 'Se eliminó correctamente', next);
        } catch (error) {
            return next(new ErrorHandler('Hubo un error al eliminar', 500));
        }
    }


}