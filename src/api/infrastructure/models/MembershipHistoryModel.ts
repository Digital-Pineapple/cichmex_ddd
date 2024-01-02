import mongoose, {model, Schema } from "mongoose";
import { MembershipHistory } from "../../domain/membership/MembershipEntity";



import MongooseDelete = require("mongoose-delete");

const MembershipHistorySchema = new mongoose.Schema<MembershipHistory>(
  {
    date_service: {
      type: Date,
    },
    membershipBenefit_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Aplica el plugin mongoose-delete al esquema
MembershipHistorySchema.plugin(MongooseDelete, { overrideMethods:true});

const MembershipHistoryModel = model<Document & MembershipHistory>(
  'MembershioHistoryModel',
  MembershipHistorySchema
);

export default MembershipHistoryModel;

