import { SubCategory } from "../subCategory/SubCategoryEntity";

import MongooseDelete = require("mongoose-delete");

export interface ServicesEntity extends MongooseDelete.SoftDeleteInterface {
    name: string;
    description: string;
    image?: string;
    subCategory: SubCategory;
}