import { CustomerEntity } from "../customer/CustomerEntity";
import { SubCategory } from '../subCategory/SubCategoryEntity';

export interface IServices {
    _id            :   string;
    name           :   string;
    description    :   string;
    status         :   boolean;
    service_image ?:   string;
    price          :   number,
    SubCategory    :   SubCategory;
}

export interface ServiceCustomer {
customer_id        :   CustomerEntity;
services           :   IServices[];
status             :   boolean;
createdAt         ?:   NativeDate;
updatedAt         ?:   NativeDate;

}