import { ICarService } from "../carService/CarServiceEntity";
import { SubCategory } from '../subCategory/SubCategoryEntity';
import { UserEntity } from "../user/UserEntity";

export interface IServices {
    _id            :   string;
    name           :   string;
    description    :   string;
    status?:boolean;
    service_image ?:   string;
    SubCategory    :   SubCategory;
    typeCarService ?:   [ICarService];
}

export interface ServiceCustomer {
user_id        :   UserEntity;
services           :   [IServices];
status?:boolean;
createdAt         ?:   NativeDate;
updatedAt         ?:   NativeDate;

}