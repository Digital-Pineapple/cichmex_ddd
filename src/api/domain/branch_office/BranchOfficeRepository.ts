import { ErrorHandler } from "../../../shared/domain/ErrorHandler"
import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { BranchOfficeEntity, BranchOfficeResponse } from "./BranchOfficeEntity"


export interface BranchOfficeRepository extends MongoRepository {

    getInfoBranches(query: Object): Promise<BranchOfficeEntity[] | ErrorHandler| BranchOfficeResponse[] | null>


}