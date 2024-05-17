import MongooseDelete = require("mongoose-delete");
import { ServicesEntity } from "../services/ServicesEntity";
import { TypeCarEntity } from "../typeCar/TypeCarEntity";
import { UserEntity } from "../user/UserEntity";
import { BranchOfficeEntity } from "../branch_office/BranchOfficeEntity";

export interface ServicesInBranchEntity extends MongooseDelete.SoftDeleteInterface {
    branch_id   : BranchOfficeEntity;
    service_id  : ServicesEntity;
    typeCar_id  : TypeCarEntity;
    price       : number;
    description ?: string;
    status?:boolean;
}
