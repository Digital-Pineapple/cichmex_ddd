import { SubCategory } from "../subCategory/SubCategoryEntity";

export interface ServicesEntity  {
    name: string;
    description: string;
    image?: string;
    subCategory: SubCategory;
    status?:boolean;
}