import { Schema, model } from 'mongoose';
import { MembershipEntity } from '../../../domain/membership/MembershipEntity';

const MembershipSchema = new Schema<MembershipEntity>(
    {
      
      name:{
        type: String,
        required: true,
      },
      price_standard: {
        type: Number,
        required:true,
    },
    discount_porcent:{
      type:Number,
      required:false,
    },
    discount_products:{
      type:Number,
      required:false,
    },
      price_discount:{
        type:Number,
      },
      service_quantity:{
        type: Array,
        required: false
      },
     type_cars:{
      type:Array,
      required:false,
      ref:'TypeCar'
      
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

  const MembershipModel = model('Memberships', MembershipSchema);

  export default MembershipModel;