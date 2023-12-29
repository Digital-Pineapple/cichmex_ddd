import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { StockBranchUseCase } from '../../../application/stockBranch/stockBranchUseCase'
import { stockBranchPopulateConfig  } from '../../../../shared/domain/PopulateInterfaces';
//';


export class StockBranchController extends ResponseData {
    protected path = '/stock_branch';

    constructor(private stockBranchUseCase: StockBranchUseCase) {
        super();
        this.getAllStockInBranch = this.getAllStockInBranch.bind(this);
        this.getOneStockBranchDetail = this.getOneStockBranchDetail.bind(this);
        this.createStockBranch = this.createStockBranch.bind(this);
        this.updateStockBranch = this.updateStockBranch.bind(this);
        // this.deleteBranchOffice = this.deleteBranchOffice.bind(this);

    }

    public async getAllStockInBranch(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        try {
            const response = await this.stockBranchUseCase.getStockInBranch(id);
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getOneStockBranchDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { product_id}= req.body
        const branch_id = id
        try {
          const response = await this.stockBranchUseCase.getOneStockInBranch(branch_id,product_id, stockBranchPopulateConfig)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async createStockBranch(req: Request, res: Response, next: NextFunction) {
         const { branch_id, product_id,stock  } = req.body;
         try{ 
            const available = await this.stockBranchUseCase.getOneStockInBranch(branch_id,product_id, stockBranchPopulateConfig)
            const available_id = available?._id 
            if (!available) {
                const response = await this.stockBranchUseCase.createStockBranch({branch_id, product_id,stock})
               this.invoke(response, 201, res, 'Se creó con éxito', next); 
            }else{
                next(new ErrorHandler(`Ya exite producto con id:${available_id} `, 500));
            }
        }
        catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al crear', 500));
        }

    }

    public async updateStockBranch(req: Request, res: Response, next: NextFunction) {
        const { id }= req.params
        const { stock  } = req.body;
        
        try {
           const response = await this.stockBranchUseCase.updateStockBranch(id,{stock:stock})
                this.invoke(response, 201, res, 'Se actualizó con éxito', next);     
            
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

    // public async deleteBranchOffice(req: Request, res: Response, next: NextFunction) {
    //     const { id } = req.params;
    //     try {
    //         const response = await this.branchOfficeUseCase.deleteOneBranchOffice(id)
    //         this.invoke(response, 201, res, 'Se elimino con exito', next);
    //     } catch (error) {
    //         next(new ErrorHandler('Hubo un error eliminar', 500));
    //     }
    // }

  


}