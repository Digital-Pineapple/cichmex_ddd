import mongoose from "mongoose";
import { Category } from "../category/CategoryEntity";

import MongooseDelete = require("mongoose-delete");

export interface SubCategory extends MongooseDelete.SoftDeleteDocument {
    name: string;
    description: string;
    subCategory_image ?: string;
    category_id: mongoose.Types.ObjectId;
}

