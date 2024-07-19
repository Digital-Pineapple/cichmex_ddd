import { MongoRepository } from "../../infrastructure/repository/MongoRepository"

export interface StockStoreHouseRepository extends MongoRepository {

    findStockByStoreHouse(id: any, populateOne?: any, populateTwo?: any): Promise<any>

    findStockByStoreHouseNoDetail(id: any, populateOne?: any, populateTwo?: any): Promise<any>

    findAllInputs(): Promise <any>

    findAllOutputs(): Promise <any>

}
export interface StockSHInputRepository extends MongoRepository {
    findStockByStoreHouse(id: any, populateOne?: any, populateTwo?: any): Promise<any>

    findStockByStoreHouseNoDetail(id: any, populateOne?: any, populateTwo?: any): Promise<any>

}
export interface StockSHOutputRepository extends MongoRepository {
    findStockByStoreHouse(id: any, populateOne?: any, populateTwo?: any): Promise<any>

    findStockByStoreHouseNoDetail(id: any, populateOne?: any, populateTwo?: any): Promise<any>

}
export interface StockSHReturnRepository extends MongoRepository {
    findStockByStoreHouse(id: any, populateOne?: any, populateTwo?: any): Promise<any>

    findStockByStoreHouseNoDetail(id: any, populateOne?: any, populateTwo?: any): Promise<any>

}