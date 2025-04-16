import { zoneRepository } from '../../domain/warehouse/zoneRepository';
import { aisleRepository } from '../../domain/warehouse/aisleRepository'
import { sectionRepository } from '../../domain/warehouse/sectionRepository'
import { IZone } from '../../domain/warehouse/zoneEntity';
import { IAisle } from '../../domain/warehouse/aisleEntity';
import { ISection } from '../../domain/warehouse/sectionEntity';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { PopulateAisle, PopulateStorehouse, PopulateZone } from '../../../shared/domain/PopulateInterfaces';
export class WarehouseUseCase {

    constructor(private readonly zoneRepository: zoneRepository,
        private readonly aisleRepository: aisleRepository,
        private readonly sectionRepository: sectionRepository
    ) { }

    public async getAllZones(): Promise<IZone[] | ErrorHandler | null> {
        return await this.zoneRepository.findAll(PopulateStorehouse)
    }
    public async getAllZonesByStorehouse(storehouse: any): Promise<IZone[] | ErrorHandler | null> {
        return await this.zoneRepository.findAllItems({status: true, storehouse:storehouse })
    }
    public async getAllAisles(): Promise<IZone[] | ErrorHandler | null> {
        return await this.aisleRepository.findAll(PopulateZone, PopulateStorehouse )
    }
    public async getAllAislesByStorehouse(storehouse: any): Promise<IZone[] | ErrorHandler | null> {
        return await this.aisleRepository.findAllItems({status: true, storehouse:storehouse }, PopulateZone)
    }
    public async getAllSections(): Promise<ISection[] | ErrorHandler | null> {
        return await this.sectionRepository.findAll(PopulateAisle, PopulateStorehouse)
    }
    public async getAllSectionsByStorehouse(storehouse: any): Promise<ISection[] | ErrorHandler | null> {
        return await this.sectionRepository.findAllItems({status: true, storehouse:storehouse })
    }
    public async getOneAisle(id: any): Promise<IAisle | null> {
        return await this.aisleRepository.getAllDetailAisle(id)
    }
    public async getOneAisleAdd(id: any): Promise<IAisle | null> {
        return await this.aisleRepository.findById(id, PopulateZone, PopulateStorehouse)
    }
    public async getOneZone(id: any): Promise<IZone | null> {
        return await this.zoneRepository.findById(id, PopulateStorehouse)
    }
    public async getOneSection(id: string): Promise<ISection | null> {
        return await this.sectionRepository.findById(id, PopulateAisle)
    }
    public async getDetailSection(id: string): Promise<ISection[] | null> {
        return await this.sectionRepository.findDetailSection(id)
    }
    public async searchProductInSection(id: string): Promise<ISection | null> {
        return await this.sectionRepository.findOneItem({ $or:[{"stock.product": id}, {"stock.variant":id}] }, PopulateAisle)
    }
    public async getProductInSection(product_id: string): Promise<ISection[] | null> {
        return await this.sectionRepository.findProductInSections(product_id)
    }
    public async getVariantInSection(variant_id: string): Promise<ISection[] | null> {
        return await this.sectionRepository.findVariantInSections(variant_id)
    }
    public async crateZone(body: any): Promise<IZone | ErrorHandler | null> {
        const noRepeat = await this.zoneRepository.findOneItem({ name: body.name, status: true, storehouse: body.storehouse })
        if (noRepeat) {
            return new ErrorHandler(`Ya existe una zona con el nombre: ${noRepeat.name}`, 400)
        }
        return await this.zoneRepository.createOne({ ...body })
    }
    public async createAisle(body: any): Promise<IAisle | ErrorHandler | null> {
        const noRepeat = await this.aisleRepository.findOneItem({ name: body.name, zone: body.zone, status: true, storehouse: body.storehouse }, PopulateZone)
        if (noRepeat) {
            throw new ErrorHandler(`Ya existe una pasillo con el nombre: ${noRepeat.name} en la zona : ${noRepeat.zone.name}`, 400)
        }
        return await this.aisleRepository.createOne({ ...body })
    }
    public async createSection(body: any): Promise<ISection | ErrorHandler | null> {
        const noRepeat = await this.sectionRepository.findOneItem({ name: body.name, aisle: body.aisle, status: true, storehouse: body.storehouse }, PopulateAisle)
        if (noRepeat) {
            throw new ErrorHandler(`Ya existe una sección con el nombre: ${noRepeat.name} en el pasillo : ${noRepeat.aisle.name}`, 400)
        }
        return await this.sectionRepository.createOne({ ...body })
    }
    public async addProductsToSection(section_id: any, products: any): Promise<ISection | null> {
        return await this.sectionRepository.updateOne(section_id, { stock: products })
    }
    public async updateZone(id: string, updated: any): Promise<IZone | ErrorHandler | null> {
        const noRepeat = await this.zoneRepository.findOneItem({ name: updated.name, status: true });
        if (noRepeat && noRepeat.id !== id) {
            return new ErrorHandler(`Zona con nombre ${noRepeat.name} ya está en uso`, 400);
        }

        return await this.zoneRepository.updateOne(id, { ...updated });
    }
    public async updateOneAisle(id: string, updated: any): Promise<IAisle | ErrorHandler | null> {
        const noRepeat = await this.aisleRepository.findOneItem({ 
            name: updated.name, 
            status: true, 
            zone: updated.zone 
        });
        if (noRepeat && noRepeat.id !== id) {
            return new ErrorHandler(`Pasillo con nombre ${noRepeat.name} ya está en uso`, 400);
        }

        return await this.aisleRepository.updateOne(id, { ...updated });
    }
    public async updateOneSection(id: string, updated: any): Promise<ISection | ErrorHandler | null> {
        const noRepeat = await this.sectionRepository.findOneItem({ 
            name: updated.name, 
            status: true, 
            aisle: updated.aisle 
        });
        if (noRepeat && noRepeat.id !== id) {
            throw new ErrorHandler(`Sección con nombre ${noRepeat.name} ya está en uso`, 400);
        }

        return await this.sectionRepository.updateOne(id, { ...updated });
    }
    public async deleteOneZone(id: string): Promise<IZone | ErrorHandler | null> {
        const aisle = await this.aisleRepository.findOneItem({ zone: id, status: true })
        if (aisle) {
            return new ErrorHandler(`La zona tiene pasillos activos`, 400);
        }
        return await this.zoneRepository.updateOne(id, { status: false })
    }
    public async deleteOneAisle(id: string): Promise<IAisle | ErrorHandler | null> {
        const aisle = await this.sectionRepository.findOneItem({ aisle: id, status: true })
        if (aisle) {
            return new ErrorHandler(`El pasillo tiene secciones activas`, 400);
        }
        return await this.aisleRepository.updateOne(id, { status: false })
    }
    public async deleteOneSection(id: string): Promise<ISection | ErrorHandler | null> {
        const section = await this.sectionRepository.findOneItem({ _id: id, status: true })
        if (section.stock.length > 0) {
            return new ErrorHandler(`La seccion tiene stock de productos`, 400);
        }
        return await this.sectionRepository.updateOne(id, { status: false })
    }

}