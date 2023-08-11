import { SubCategory } from "../subCategory/SubCategoryEntity";

export interface ServicesEntity {
    name        :   string;
    description :   string;
    status      :   boolean; 
    service_image ?: string;
    subCategory :   SubCategory;
}