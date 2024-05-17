import mongoose, { Schema, model } from "mongoose";
import { MembershipBenefits } from "../../../domain/membership/MembershipEntity";

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
    status:{
      type:Boolean,
      required:false,
      default:true,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


const MembershipBenefitsModel = model<MembershipBenefits >(
  "MembershipBenefits",
  MembershipBenefitsSchema
);

export default MembershipBenefitsModel;
