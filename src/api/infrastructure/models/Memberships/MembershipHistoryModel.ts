import mongoose, {model, Schema } from "mongoose";
import { MembershipHistory } from "../../../domain/membership/MembershipEntity";

import MongooseDelete = require("mongoose-delete");

const MembershipHistorySchema = new mongoose.Schema<MembershipHistory>(
  {
    membershipBenefit_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    date_service: {
      type: Date,
      required:false,
    },
    typeCar_id:{
      type:mongoose.Schema.Types.ObjectId,
      required:false,
    },
    car_color:{
      type:String,
      required:false,
    },
    plate_number:{
      type: String,
      required:false
    },
    branch_office_id:{
      type:mongoose.Schema.Types.ObjectId,
      required:false,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Aplica el plugin mongoose-delete al esquema
MembershipHistorySchema.plugin(MongooseDelete, { overrideMethods:true});

const MembershipHistoryModel = model<Document & MembershipHistory>(
  'MembershipHistory',
  MembershipHistorySchema
);

export default MembershipHistoryModel;

