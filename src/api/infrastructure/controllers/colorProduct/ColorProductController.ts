import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { ColorProductUseCase } from '../../../application/colorProduct/ColorProductUseCase';
import colorProducts from '../../../../seeders/ColorProducts';

export class ColorProductController extends ResponseData {
    protected path = '/colorProduct';

    constructor(private colorProductUseCase: ColorProductUseCase) {
        super();
        this.getAllColors = this.getAllColors.bind(this);
        this.seedColors = this.seedColors.bind(this)
        this.addOneColor = this.addOneColor.bind(this)


    }

    public async getAllColors(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.colorProductUseCase.getColors()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async addOneColor(req: Request, res: Response, next: NextFunction) {
        const {name, hex} = req.body
        try {
            const response = await this.colorProductUseCase.addOneColor({name,hex})
            this.invoke(response, 200, res, 'Se agrego el color correctamente', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async seedColors(req: Request, res: Response, next: NextFunction) {
        let colors = colorProducts
        try {
            Promise.all(
                colors.map(async(color: any)=>{
                    await this.colorProductUseCase.addOneColor({...color})
                })
            )
            this.invoke('', 200, res, 'Se agregaron colores a la base de datos', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    

}