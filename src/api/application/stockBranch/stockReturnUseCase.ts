import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { StockReturnRepository } from '../../domain/stockBranch/StockBranchRepository';
import { IProductReturn } from '../../domain/stockBranch/StockBranchEntity';


export class StockReturnUseCase {
    protected path = '/stock-branch'

    constructor(private readonly stockReturnRepository: StockReturnRepository) { }


    public async createReturn(body:object): Promise<IProductReturn | null> {
        return this.stockReturnRepository.createOne({...body})
    }
    

}