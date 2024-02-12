import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { DocumentationRepository } from '../../domain/documentation/DocumentationRepository';
import { IFile } from '../../domain/documentation/DocumentationsEntity';


export class DocumentationUseCase {

    constructor(private readonly documentRepository: DocumentationRepository) { }

    public async getDocumentations(): Promise<IFile | ErrorHandler | null> {
        return await this.documentRepository.findAll();
    }

    public async getDetailDocumentation(_id: string): Promise<IFile | null> {
        return await this.documentRepository.findById(_id);
    }

    public async getDocumentationByUser(_id: string): Promise<IFile | ErrorHandler | null> {
        
        return await this.documentRepository.findByUser(_id)
    }

    public async getDocumentByNameAndCustomer(customer_id: string, name:string ): Promise<IFile | ErrorHandler | null> {
        
        return await this.documentRepository.findByCustomerAndName(customer_id, name);
    }

    
    
    public async createNewDocumentation(name: string , message: string, user_id: any,  url: any, verify: boolean ): Promise<IFile | ErrorHandler | null> {
        const customer = await this.documentRepository.findOneItem({ user_id, name });
        if (customer) { return new ErrorHandler('Ya existe documentacion en este usuario', 400)}
        else{
        return await this.documentRepository.createOne({ name, url, message,user_id, verify });}
    }
    

    public async updateOneDocumentation(_id: string, updated: object): Promise<IFile | null> {
        return await this.documentRepository.updateOne(_id, updated);
    }

}