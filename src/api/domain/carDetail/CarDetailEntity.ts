
import { TypeCarEntity } from "../typeCar/TypeCarEntity";
import { UserEntity } from "../user/UserEntity";

export interface CarDetail {
    _id: string;
    customer_id?: UserEntity;
    typeCar_id?: TypeCarEntity;
    carDetail_image?: string;
    plate_number: string;
    status?:boolean;
    // brand?: string;
    // model ?: string;
    // version: string;
}
