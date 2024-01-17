import mongoose from "mongoose";

import MongooseDelete = require("mongoose-delete");

export interface TypeUserEntity extends MongooseDelete.SoftDeleteInterface {
    _id  ?: string;
    name : string;
    type : number;
    
}

