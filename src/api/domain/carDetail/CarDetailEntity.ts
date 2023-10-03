import { CustomerEntity } from "../customer/CustomerEntity";
import { TypeCarEntity } from "../typeCar/TypeCarEntity";

export interface CarDetail {
    _id: string;
    customer_id?: CustomerEntity;
    typeCar_id?: TypeCarEntity;
    carDetail_image?: string;
    plate_number: string;
    status: boolean;
    // brand?: string;
    // model ?: string;
    // version: string;
}
