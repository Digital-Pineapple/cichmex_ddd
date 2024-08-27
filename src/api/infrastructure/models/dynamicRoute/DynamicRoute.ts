import mongoose, { model, Schema } from "mongoose";
import { DynamicRouteEntity } from "../../../domain/dynamicRoute/DynamicRouteEntity";

const DynamicRouteSchema = new Schema<DynamicRouteEntity>({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    uuid: {
        type: String,
        unique: true,
    },
    name:{
        type: String,
        reqired: true
    },
    path:{
        type: String,
        reqired: true
    },
    layout:{
        type: String,
        reqired: true
    },
    component:{
        type:Number,
        reqired: true,
    },
    authRequired:{
        type: Boolean,
        required:true
    },
    rolesAllowed:{
        type: [String],
        required:true
    },
    system:{
        type:String,
        required:true
    },
    status: {
        type: Boolean,
        required: false,
        default:true,
    },

}, {
    versionKey: false,
    timestamps: true,
});

const DynamicRoutesModel = model('dynamicroutes', DynamicRouteSchema);

export default DynamicRoutesModel;