import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { StockBranchRepository } from '../../domain/stockBranch/StockBranchRepository';
import { StockBranchEntity } from '../../domain/stockBranch/StockBranchEntity';


export class StockBranchUseCase {
    protected path = '/stock-branch'

    constructor(private readonly stockBranchRepository: StockBranchRepository) { }

    public async getStockInBranch(_id:string): Promise<StockBranchEntity[] | ErrorHandler | null> {
        return await this.stockBranchRepository.findStockByBranch(_id);
    }
    public async getOneStockInBranch(branch_id: string , product_id: string, populateConfig:any ) : Promise <StockBranchEntity | ErrorHandler| null> { 
          return await this.stockBranchRepository.findOneStockByBranch(branch_id,product_id, populateConfig)    
    }  

    public async getDetailStock(_id: string): Promise<StockBranchEntity | null> {
        return await this.stockBranchRepository.findById(_id);
    }

    public async createStockBranch(body:object): Promise<StockBranchEntity | null> {
        return this.stockBranchRepository.createOne({...body})
    }
    public async updateStockBranch(_id: string,updated: object): Promise<StockBranchEntity  | null> {
        return await this.stockBranchRepository.updateOne(_id,updated);
    }
    public async deleteStockBranch(_id: string): Promise<StockBranchEntity | null> {
        return this.stockBranchRepository.updateOne(_id, {deleted: false})
    }
    

}