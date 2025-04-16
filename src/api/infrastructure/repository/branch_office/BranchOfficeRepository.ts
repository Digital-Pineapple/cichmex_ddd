import { MongoRepository } from '../MongoRepository';
import { BranchOfficeEntity,BranchOfficeResponse,ILocation } from '../../../domain/branch_office/BranchOfficeEntity';
import { BranchOfficeRepository as BranchOfficeConfig } from '../../../domain/branch_office/BranchOfficeRepository';
import { Model } from 'mongoose';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';


// Esta clase extiende de MongoRepository y implementa la interfaz BranchOfficeConfig, lo que significa que debe cumplir con los métodos definidos en BranchOfficeConfig.
export class BranchOfficeRepository extends MongoRepository implements BranchOfficeConfig {
    
    // El constructor recibe el modelo de BranchOffice y lo asigna a una propiedad protegida.
    constructor(protected BranchOfficeModel: Model<any>) {
        super(BranchOfficeModel);
    }

    // Este método busca todas las sucursales que coinciden con la consulta especificada.
    async getInfoBranches(query: Object): Promise<BranchOfficeEntity[] | ErrorHandler| BranchOfficeResponse[] | null> {
        // Utiliza el método findAll de MongoRepository para buscar todas las sucursales que coinciden con la consulta.
        return await this.findAll({...query})
    }

    // Este método busca una sucursal específica basada en una consulta.
    async findOneBranchOffice(query: Object): Promise<BranchOfficeEntity | null> {
        // Utiliza el método findOneItem de MongoRepository para buscar una sucursal específica.
        return await this.findOneItem(query);
    }

    // Este método busca una sucursal específica por su ID.
    async findByIdBranchOffice(_id: String): Promise<BranchOfficeEntity | null> {
        // Utiliza el método findById de MongoRepository para buscar una sucursal específica por su ID.
        return await this.findById(_id);
    }

    // Este método actualiza una sucursal específica por su ID.
    async findAndUpdateBranchOffice(_id: String, updated: object): Promise<BranchOfficeEntity | null> {
        // Utiliza el método updateOne de MongoRepository para actualizar una sucursal específica.
        return await this.updateOne(_id, updated);
    }
    
    // Este método busca todas las sucursales.
    async findAllBranchOffices(): Promise<BranchOfficeEntity[] | null> {
        // Utiliza el método findAll de MongoRepository para buscar todas las sucursales.
        return await this.findAll();
    }

    // Este método crea una nueva sucursal.
    async createOneBranchOffice(body: Object): Promise<BranchOfficeEntity | null> {
        // Utiliza el método createOne de MongoRepository para crear una nueva sucursal.
        return await this.createOne(body);
    }

    // Este método busca todas las sucursales de Cichmex.
    async getCichmexBranches(): Promise<BranchOfficeEntity[] | null> {
        // Utiliza el método findAll de MongoRepository para buscar todas las sucursales de Cichmex.
        return await this.findAll({ tag : "cichmex"});
    }   
    // Este método busca las sucursales más cercanas a una ubicación específica.
    async findCloserBranches(coords : { lat: number, lng: number }): Promise<BranchOfficeEntity[] | null> {
        // Utiliza el modelo de BranchOffice para ejecutar una agregación de MongoDB para encontrar las sucursales más cercanas.
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