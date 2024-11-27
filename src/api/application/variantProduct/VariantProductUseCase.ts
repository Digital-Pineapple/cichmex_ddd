import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { variantProductRepository } from '../../domain/variantProduct/variantProductRepository';
import { VariantProductEntity } from '../../domain/variantProduct/variantProductEntity';
export class VariantProductUseCase {

    constructor(private readonly variantProductRepository: variantProductRepository) { }

    public async CreateVariant(body: any): Promise<VariantProductEntity | ErrorHandler | null> {
        return await this.variantProductRepository.createOne({ ...body })
    }
}