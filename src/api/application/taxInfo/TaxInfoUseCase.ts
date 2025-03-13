import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { TaxInfoRepository } from '../../domain/taxInfo/TaxInfoRepository';
import { ITaxInfoEntity } from '../../domain/taxInfo/TaxInfoEntity';
import { FacturapiService } from '../../../shared/infrastructure/facturapi/FacturapiService';


export class TaxInfoUseCase {
    protected path = '/tax-info'

    constructor(private readonly taxInfoRepository: TaxInfoRepository, private readonly facturapiService: FacturapiService) { }

    public async getAllTaxInfo(): Promise<ITaxInfoEntity | ErrorHandler | null> {
        return await this.taxInfoRepository.findAll()
    }
    public async getMyTaxInfo(user: any): Promise<ITaxInfoEntity | ErrorHandler | null> {
        return await this.taxInfoRepository.findOneItem({user:user})
    }

    public async createTaxInfo(user_id: any, body: any, ): Promise<ITaxInfoEntity | ErrorHandler | null> {
        const taxInfoUser: any | null = await this.taxInfoRepository.findOneItem({user: user_id, status: true });              
        if(taxInfoUser){
            return new ErrorHandler('Ya cuenta con información registrada', 500);
        }          
        const facturapiCustomer = await this.facturapiService.createCustomer(body);   
        const customer = await this.taxInfoRepository.createOne({...body,user: user_id, facturapi_id: facturapiCustomer.id})
        return customer                
    }

    public async updateTaxInfo(id :any , body: any): Promise<ITaxInfoEntity | ErrorHandler | null> {
        const taxInfoUser: any | null = await this.taxInfoRepository.findOneItem({user: id, status: true });     
        const taxInfo = await this.taxInfoRepository.updateOne(id, {...body});
        if(taxInfo){
          await this.facturapiService.editCustomer(taxInfoUser.facturapi_id, body);      
        }
        return taxInfo
    }

    public async deleteTaxInfo(id :any): Promise<ITaxInfoEntity | ErrorHandler | null> {
        return await this.taxInfoRepository.updateOne(id, {status:false})
    }

    public async createInvoice(user_id: any, body: any): Promise<any | ErrorHandler | null> {
        const taxInfoUser: any | null = await this.taxInfoRepository.findOneItem({user: user_id, status: true });              
        if(!taxInfoUser){
            return new ErrorHandler('No tienes información registrada', 404);
        }          
        try {
            const invoice = await this.facturapiService.createInvoice(body);
            return invoice;
        } catch (error) {
            return new ErrorHandler('Error al crear la factura', 500);
        }
    }



}