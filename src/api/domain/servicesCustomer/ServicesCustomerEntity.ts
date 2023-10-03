import { ICarService } from "../carService/CarServiceEntity";
import { CustomerEntity } from "../customer/CustomerEntity";
import { SubCategory } from '../subCategory/SubCategoryEntity';

export interface IServices {
    _id            :   string;
    name           :   string;
    description    :   string;
    status         :   boolean;
    service_image ?:   string;
    SubCategory    :   SubCategory;
    typeCarService ?:   [ICarService];
}

export interface ServiceCustomer {
customer_id        :   CustomerEntity;
services           :   [IServices];
status             :   boolean;
createdAt         ?:   NativeDate;
updatedAt         ?:   NativeDate;

}