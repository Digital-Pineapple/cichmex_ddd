import mongoose from "mongoose";

import MongooseDelete = require("mongoose-delete");

export interface TypeUser extends MongooseDelete.SoftDeleteInterface {
    _id: string;
    name: string;
    
}

