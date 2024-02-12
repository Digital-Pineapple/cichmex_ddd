import mongoose, { Schema, model } from "mongoose";
import { MembershipBenefits } from "../../../domain/membership/MembershipEntity";
import MongooseDelete = require("mongoose-delete");

const MembershipBenefitsSchema = new Schema<MembershipBenefits>(
  {
    membership_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'Memberships'
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'Services'
    },
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'Users'
    },
    quantity: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    activated: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

MembershipBenefitsSchema.plugin(MongooseDelete,{overrideMethods:'all'})

const MembershipBenefitsModel = model<Document & typeof MembershipBenefitsSchema >(
  "MembershipBenefits",
  MembershipBenefitsSchema
);

export default MembershipBenefitsModel;
