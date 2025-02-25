import { MongoRepository } from '../MongoRepository';
import { BranchOfficeEntity,BranchOfficeResponse,ILocation } from '../../../domain/branch_office/BranchOfficeEntity';
import { BranchOfficeRepository as BranchOfficeConfig } from '../../../domain/branch_office/BranchOfficeRepository';
import { Model } from 'mongoose';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';



export class BranchOfficeRepository extends MongoRepository implements BranchOfficeConfig {
    

    constructor(protected BranchOfficeModel: Model<any>) {
        super(BranchOfficeModel);
    }

    async getInfoBranches(query: Object): Promise<BranchOfficeEntity[] | ErrorHandler| BranchOfficeResponse[] | null> {
        return await this.findAll({...query})

    }

    async findOneBranchOffice(query: Object): Promise<BranchOfficeEntity | null> {
        return await this.findOneItem(query);
    }

    async findByIdBranchOffice(_id: String): Promise<BranchOfficeEntity | null> {
        return await this.findById(_id);
    }
    async findAndUpdateBranchOffice(_id: String, updated: object): Promise<BranchOfficeEntity | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllBranchOffices(): Promise<BranchOfficeEntity[] | null> {
        return await this.findAll();
    }

    async createOneBranchOffice(body: Object): Promise<BranchOfficeEntity | null> {
        return await this.createOne(body);
    }
    async getCichmexBranches(): Promise<BranchOfficeEntity[] | null> {
        return await this.findAll({ tag : "cichmex"});
    }   
    async findCloserBranches(coords : { lat: number, lng: number }): Promise<BranchOfficeEntity[] | null> {
        const branches =  await this.BranchOfficeModel.aggregate([
        // Agregar un campo `location.coordinates` en tiempo de consulta
            {
              $geoNear: {
                near: {
                  type: 'Point',
                  coordinates: [coords.lng, coords.lat], // [longitud, latitud]
                },
                distanceField: 'distance', // Campo que almacenará la distancia
                spherical: true, // Para cálculos en una esfera (Tierra)                
                key: "location.geoLocation", // 👈 Especifica la ruta del campo GeoJSON
              },

            },
            {
                $match: {
                    status: true,
                    activated: true,
                }
            },
            // Opcional: Limitar resultados
            { $limit: 15 },
          ]);             
        return branches;
    }   
           

}