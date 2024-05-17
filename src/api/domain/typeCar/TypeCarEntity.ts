import MongooseDelete = require("mongoose-delete");
export interface TypeCarEntity extends MongooseDelete.SoftDeleteInterface {
    name             :   string;
    typeCar_image    ?:   string;
    status?: boolean;
    createdAt       ?:   NativeDate;
    updatedAt       ?:   NativeDate;
}