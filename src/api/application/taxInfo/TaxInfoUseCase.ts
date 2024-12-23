import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { TaxInfoRepository } from '../../domain/taxInfo/TaxInfoRepository';
import { ITaxInfoEntity } from '../../domain/taxInfo/TaxInfoEntity';


export class TaxInfoUseCase {
    protected path = '/tax-info'

    constructor(private readonly taxInfoRepository: TaxInfoRepository) { }

    public async getAllTaxInfo(): Promise<ITaxInfoEntity | ErrorHandler | null> {
        return await this.taxInfoRepository.findAll()
    }
    public async getMyTaxInfo(user: any): Promise<ITaxInfoEntity | ErrorHandler | null> {
        return await this.taxInfoRepository.findOneItem({user:user})
    }

    public async createTaxInfo(user_id: any, body: any, ): Promise<ITaxInfoEntity | ErrorHandler | null> {
        const noRepeat = await this.taxInfoRepository.findOneItem({user: user_id, status: true })
       if (noRepeat) {
        return new ErrorHandler('Ya cuenta con información registrada', 500)
       }
        return await this.taxInfoRepository.createOne({...body})
    }

    public async updateTaxInfo(id :any , body: any): Promise<ITaxInfoEntity | ErrorHandler | null> {
        return await this.taxInfoRepository.updateOne(id, {...body})
    }

    public async deleteTaxInfo(id :any): Promise<ITaxInfoEntity | ErrorHandler | null> {
        return await this.taxInfoRepository.updateOne(id, {status:false})
    }


}