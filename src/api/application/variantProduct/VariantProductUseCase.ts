import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { variantProductRepository } from '../../domain/variantProduct/variantProductRepository';
import { VariantProductEntity } from '../../domain/variantProduct/variantProductEntity';
export class VariantProductUseCase {

    constructor(private readonly variantProductRepository: variantProductRepository) { }

    public async CreateVariant(body: any): Promise<VariantProductEntity | ErrorHandler | null> {
        return await this.variantProductRepository.createOne({ ...body })
    }
    public async UpdateVariant(id: any,body: any): Promise<VariantProductEntity | ErrorHandler | null> {
        return await this.variantProductRepository.updateOne(id,{...body})
    }
    public async findAllVarinatsByProduct(product_id: any): Promise<VariantProductEntity[] | null> {
        return await this.variantProductRepository.findVariantsByProduct({product_id: product_id, status: true})
    }
    public async findVariantById(variant_id: any): Promise<VariantProductEntity[] | ErrorHandler | null> {
        return await this.variantProductRepository.findOneItem({_id: variant_id})
    }
    public async findAllVariants(): Promise<VariantProductEntity[] | ErrorHandler | null> {
        return await this.variantProductRepository.findAll()
    }
}