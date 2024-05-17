import mongoose from "mongoose";
import { Category } from "../category/CategoryEntity";

import MongooseDelete = require("mongoose-delete");

export interface SubCategory extends MongooseDelete.SoftDeleteInterface {
    name: string;
    subCategory_image ?: string;
    category_id    ?: string ; 
    status?: boolean;

}

