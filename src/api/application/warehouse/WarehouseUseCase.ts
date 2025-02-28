import { zoneRepository } from '../../domain/warehouse/zoneRepository';
import { aisleRepository } from '../../domain/warehouse/aisleRepository'
import { sectionRepository } from '../../domain/warehouse/sectionRepository'
import { IZone } from '../../domain/warehouse/zoneEntity';
import { IAisle } from '../../domain/warehouse/aisleEntity';
import { ISection } from '../../domain/warehouse/sectionEntity';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { PopulateAisle, PopulateZone } from '../../../shared/domain/PopulateInterfaces';
export class WarehouseUseCase {

    constructor(private readonly zoneRepository: zoneRepository,
        private readonly aisleRepository: aisleRepository,
        private readonly sectionRepository: sectionRepository
    ) { }

    public async getAllZones(): Promise<IZone[] | ErrorHandler| null> {
        return await this.zoneRepository.findAll()
    }
    public async getAllAisles(): Promise<IZone[] | ErrorHandler| null> {
        return await this.aisleRepository.findAll(PopulateZone)
    }
    public async getAllSections(): Promise<ISection[] | ErrorHandler| null> {
        return await this.sectionRepository.findAll()
    }
    public async getOneAisle(id:string): Promise<IAisle | null> {
        return await this.aisleRepository.getAllDetailAisle(id)
    }
    public async getOneSection(id:string): Promise<ISection | null> {
        return await this.sectionRepository.findById(id)
    }
    public async getProductInSection(product_id: string): Promise<ISection[] | null> {
        return await this.sectionRepository.findProductInSections(product_id)
    }
    public async getVariantInSection(variant_id: string): Promise<ISection[] | null> {
        return await this.sectionRepository.findVariantInSections(variant_id)
    }
    public async crateZone(body: any): Promise<IZone | ErrorHandler| null> {
        const noRepeat = await this.zoneRepository.findOneItem({name: body.name, status :true, storehouse: body.storehouse})
        if (noRepeat) {
            return  new ErrorHandler(`Ya existe una zona con el nombre: ${noRepeat.name}`,400)
        }
        return await this.zoneRepository.createOne({...body})
    }
    public async createAisle(body: any): Promise<IAisle | ErrorHandler | null> {
        const noRepeat = await this.aisleRepository.findOneItem({name: body.name,zone: body.zone, status :true, storehouse: body.storehouse}, PopulateZone)
        if (noRepeat) {
            throw  new ErrorHandler(`Ya existe una pasillo con el nombre: ${noRepeat.name} en la zona : ${noRepeat.zone.name}`,400)
        }
        return await this.aisleRepository.createOne({...body})
    }
    public async createSection(body: any): Promise<ISection | ErrorHandler | null> {
        const noRepeat = await this.sectionRepository.findOneItem({name: body.name,aisle: body.aisle, status :true, storehouse: body.storehouse}, PopulateAisle)
        if (noRepeat) {
            throw  new ErrorHandler(`Ya existe una sección con el nombre: ${noRepeat.name} en el pasillo : ${noRepeat.aisle.name}`,400)
        }
        return await this.sectionRepository.createOne({...body})
    }
    public async addProductsToSection(section_id: any, products: any): Promise<ISection | null> {
        return await this.sectionRepository.updateOne(section_id,{stock: products})
    }
}