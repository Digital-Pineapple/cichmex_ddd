import { Model } from 'mongoose';

import { DocumentationRepository as ServicesConfig } from '../../../domain/documentation/DocumentationRepository';
import { MongoRepository } from '../MongoRepository';
import { IFile } from '../../../domain/documentation/DocumentationsEntity';


export class DocumentationRepository extends MongoRepository implements ServicesConfig {

    constructor(protected DocumentationModel: Model<any>) {
        super(DocumentationModel)
    }

    async findOneDocumentation(query: Object): Promise<IFile | null> {
        return await this.findOneItem(query);
    }

    async findByIdDocumentation(_id: String): Promise<IFile | null> {
        return await this.findById(_id);
    }
    async findAndUpdateDocumentation(_id: String, updated: object): Promise<IFile | null> {
        return await this.updateOne(_id, updated);
    }
    async findAllDocumentations(): Promise<IFile[] | null> {
        return await this.findAll();
    }

    async createOneDocumentation(body: Object): Promise<IFile | null> {
        return await this.createOne(body);
    }

    async deleteOneDocumentation(_id: string): Promise<IFile | null> {
        return await this.DocumentationModel.findByIdAndUpdate(_id, { status: false }, { new: true });
    }
}