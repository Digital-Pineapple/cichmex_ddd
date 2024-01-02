import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { StockOutputRepository } from '../../domain/stockBranch/StockBranchRepository';
import { IProductOutput } from '../../domain/stockBranch/StockBranchEntity';


export class StockOutputhUseCase {
    protected path = '/stock-branch'

    constructor(private readonly stockOutputRepository: StockOutputRepository) { }

    public async createOutStock(body:object): Promise<IProductOutput | null> {
        return this.stockOutputRepository.createOne({...body})
    }
    

}