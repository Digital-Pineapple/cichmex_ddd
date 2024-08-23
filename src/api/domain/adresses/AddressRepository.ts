import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { AddressEntity } from "./AddressEntity"


export interface AddressRepository extends MongoRepository {

    findAddressesByUser(_id:string, populateCofig1?:any): Promise<AddressEntity[]| ErrorHandler | null>
    createOneAddress(_id:string, body: object): Promise<AddressEntity | null>
    updateOneAddress(_id:string, body: object): Promise<AddressEntity | null>
    deleteOneAddress(_id:string): Promise<AddressEntity | null>

}