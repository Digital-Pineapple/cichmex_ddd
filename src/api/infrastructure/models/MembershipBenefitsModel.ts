import { Schema, model } from "mongoose";
import { MembershipBenefits } from "../../domain/membership/MembershipEntity";

const MembershipBenefitsSchema = new Schema<MembershipBenefits>(
  {
    membership_id: {
      type: String,
      required: true,
    },
    service_id: {
      type: String,
      required: true,
    },
    client_id: {
      type: String,
      required: true,
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
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const MembershipBenefitsModel = model(
  "MembershipBenefitsModel",
  MembershipBenefitsSchema
);

export default MembershipBenefitsModel;
