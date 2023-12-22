import mongoose, { Schema, model } from "mongoose";
import { MembershipHistory } from "../../domain/membership/MembershipEntity";

const MembershipHistorySchema = new Schema<MembershipHistory>(
  {
   date_service:{
    type:Date,
   },
   status:{
    type:Boolean,
   },
   membershipBenefit_id:{
    type: mongoose.Types.ObjectId,

   }
   
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const MembershipHistoryModel = model(
  "MembershioHistoryModel",
  MembershipHistorySchema
);

export default MembershipHistoryModel;
