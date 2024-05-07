import mongoose, {model, Schema } from "mongoose";
import { MembershipHistory } from "../../../domain/membership/MembershipEntity";

const MembershipHistorySchema = new mongoose.Schema<MembershipHistory>(
  {
    membershipBenefit_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    date_service: {
      type: String,
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
    },
    status:{
      type:Boolean,
      required:false
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


const MembershipHistoryModel = model< MembershipHistory>(
  'MembershipHistory',
  MembershipHistorySchema
);

export default MembershipHistoryModel;

