import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { StockBranchEntity } from "./StockBranchEntity"
import { asFunction } from 'awilix';


export interface StockBranchRepository extends MongoRepository {

    

}