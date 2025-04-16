import { ErrorHandler } from "../../../shared/domain/ErrorHandler" // Importa el manejador de errores
import { MongoRepository } from "../../infrastructure/repository/MongoRepository" // Importa el repositorio de MongoDB
import { BranchOfficeEntity, BranchOfficeResponse } from "./BranchOfficeEntity" // Importa las entidades de la sucursal de oficina

// Define la interfaz del repositorio de la sucursal de oficina, extendiendo el repositorio de MongoDB
export interface BranchOfficeRepository extends MongoRepository {
    // Método para obtener información detallada de las sucursales basado en una consulta
    getInfoBranches(query: Object): Promise<BranchOfficeEntity[] | ErrorHandler| BranchOfficeResponse[] | null>
    // Método para obtener todas las sucursales de Cichmex
    getCichmexBranches(): Promise<BranchOfficeEntity[] | null>
    // Método para encontrar las sucursales más cercanas a una ubicación específica
    findCloserBranches(coords: { lat: number, lng: number }): Promise<BranchOfficeEntity[] | null>  
}