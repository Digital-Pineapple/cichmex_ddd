import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { ColorProductEntity } from '../../domain/colorProduct/ColorProductEntity';
import { ColorProductRepository } from '../../domain/colorProduct/ColorProductRepository'

export class ColorProductUseCase {

    constructor(private readonly colorProductRepository: ColorProductRepository) { }

    public async getColors(): Promise<ColorProductEntity[] | ErrorHandler | null> {
        return await this.colorProductRepository.findAllItems({})
    }
    public async addOneColor(body: any): Promise<ColorProductEntity | ErrorHandler | null> {
        return await this.colorProductRepository.createOne({...body})
    }

    public async updateColor(color: string, hex: string ): Promise<ColorProductEntity | ErrorHandler | null> {
        const noRepeat = await this.colorProductRepository.findOneItem({color});
        if (noRepeat) return new ErrorHandler('Ya existe este color',400);
        return await this.colorProductRepository.createOne({color,hex})
    }
    public async deleteColor(_id: string): Promise<ColorProductEntity | null> {
        return this.colorProductRepository.updateOne(_id, {status: false})
    }

}