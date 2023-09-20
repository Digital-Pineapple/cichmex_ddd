import { CustomerEntity } from "../customer/CustomerEntity";

export interface CarDetail {
    customer_id ?: CustomerEntity;
    brand?: string;
    model ?: string;
    version: string;
    carDetail_image ?: string;
    plate_number : string;
    status:boolean;
}
