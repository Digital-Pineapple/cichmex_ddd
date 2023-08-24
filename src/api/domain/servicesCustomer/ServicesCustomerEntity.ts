import { CustomerEntity } from "../customer/CustomerEntity";
import { ServicesEntity } from "../services/ServicesEntity";


export interface ServiceCustomer {
customer : CustomerEntity;
service : ServicesEntity;

status : boolean;
createdAt       ?:   NativeDate;
updatedAt       ?:   NativeDate;

}