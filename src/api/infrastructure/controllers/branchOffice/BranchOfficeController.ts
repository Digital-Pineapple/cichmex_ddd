import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { BranchOfficeUseCase } from '../../../application/branchOffice/BranchOfficeUseCase';


export class BranchOfficeController extends ResponseData {
    protected path = '/branch_office';

    constructor(private branchOfficeUseCase: BranchOfficeUseCase) {
        super();
        this.getAllBranchOffices = this.getAllBranchOffices.bind(this);
        this.getBranchOfficeDetail = this.getBranchOfficeDetail.bind(this);
        this.createBranchOffice = this.createBranchOffice.bind(this);
        this.updateBranchOffice = this.updateBranchOffice.bind(this);
        this.deleteBranchOffice = this.deleteBranchOffice.bind(this);

    }

    public async getAllBranchOffices(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.branchOfficeUseCase.getAllBranchOffices();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getBranchOfficeDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.branchOfficeUseCase.getDetailBranchOffice(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async createBranchOffice(req: Request, res: Response, next: NextFunction) {
         const { customer_id, name, description, activated, location } = req.body;
         
         try{
         const response = await this.branchOfficeUseCase.createBranchOffice({customer_id, name, description, activated, location})
        this.invoke(response, 201, res, 'Se creó con éxito', next);
        }
        catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al crear', 500));
        }

    }

    public async updateBranchOffice(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, activated, location } = req.body;
        
        try {
           const response = await this.branchOfficeUseCase.updateBranchOffice(id,{name, description, activated,location})
                this.invoke(response, 201, res, 'Se actualizó con éxito', next);     
            
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar la categoría', 500));
        }
    }

    public async deleteBranchOffice(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.branchOfficeUseCase.deleteOneBranchOffice(id)
            this.invoke(response, 201, res, 'Se elimino con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }

  


}

