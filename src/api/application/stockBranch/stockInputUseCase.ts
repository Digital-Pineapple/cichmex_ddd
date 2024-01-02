import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { StockInputRepository } from '../../domain/stockBranch/StockBranchRepository';
import { IProductInput } from '../../domain/stockBranch/StockBranchEntity';


export class StockInputhUseCase {
    protected path = '/stock-branch'

    constructor(private readonly stockInputRepository: StockInputRepository) { }

    public async createInput(body:object): Promise<IProductInput> {
        return this.stockInputRepository.createOne({...body})
    }
    
    

}