import { Model } from 'mongoose';
import { ShippingCostRepository as ShippingCostConfig } from '../../../domain/shippingCost/ShippingCostRepository';
import { MongoRepository } from '../MongoRepository';
import { ShippingCostEntity } from '../../../domain/shippingCost/ShippingCostEntity';

// Clase que extiende de MongoRepository e implementa la interfaz ShippingCostConfig
export class ShippingCostRepository extends MongoRepository implements ShippingCostConfig {

    // Constructor que recibe el modelo de Mongoose para los costos de envío
    constructor(protected ShippingCostModel: Model<any>) {
        super(ShippingCostModel); // Llama al constructor de la clase base
    }

    // Método para buscar un costo de envío basado en el peso
    async findShippingCostByWeight(weight: number): Promise<ShippingCostEntity | null> {
        // console.log("peso desde el repository", weight); // Comentado: Log para depuración
        try {
            // Busca un registro en la base de datos donde el peso esté dentro del rango definido
            const result = await this.ShippingCostModel.findOne({
                minWeight: { $lte: weight }, // Peso mínimo menor o igual al peso proporcionado
                maxWeight: { $gte: weight }, // Peso máximo mayor o igual al peso proporcionado
                status: true // Solo registros con estado activo
              });
            // Código alternativo comentado para realizar la misma búsqueda con una sintaxis diferente
            // const result = await this.ShippingCostModel.findOne({
            //     $and: [
            //         { "starting_weight": { $lte: weight } },
            //         { "end_weight": { $gte: weight } },
            //         { "status": { $eq: true } }
            //     ]
            // }).exec();
            // console.log("result", result); // Comentado: Log para depuración
            return result; // Retorna el resultado encontrado o null si no hay coincidencias
        } catch (error) {
            // Log del error en caso de que ocurra algún problema durante la búsqueda
            console.log("Error al buscar el costo de envío por peso", error);        
            // Lanza un error con un mensaje descriptivo
            throw new Error((error as Error).message || 'Error al calcular costo de envio');                        
        }
    }
}
