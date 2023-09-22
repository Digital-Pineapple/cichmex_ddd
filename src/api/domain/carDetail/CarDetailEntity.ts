import { CustomerEntity } from "../customer/CustomerEntity";

export interface CarDetail {
    customer_id ?: CustomerEntity;
    carDetail_image ?: string;
    plate_number : string;
    status:boolean;
    // brand?: string;
    // model ?: string;
    // version: string;
}
