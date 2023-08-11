import { CustomerEntity } from "../customer/CustomerEntity";

export interface IFile {
    name           : string;
    message       ?: string;
    status         : boolean;
    customer_id   ?: CustomerEntity;
    url            : string;
    verify         : boolean;
}
