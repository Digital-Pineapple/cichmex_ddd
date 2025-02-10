import mongoose, { model, Mongoose, Schema } from "mongoose";
import { BannerEntity } from "../../../domain/banners/BannerEntity";


const BannerSchema = new mongoose.Schema<BannerEntity>(

  {
    
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId
      },
    is_active: {
      type: Boolean,
      required: false
    },
    no_slide: {
      type: Number,
      required: false
    },
    for_discount: {
      type: Boolean,
      required: false
    },
    discount:{
      type: mongoose.Types.ObjectId,
      required: false,
      ref: 'discountcoupons'
    },
    title: {
      type: String,
      required: false
    },
    description:{
      type: String,
      required: false
    },
    type_event: {
      type: String,
      required: false
    },
    image_slide: {
      type: String,
      required: false
    },    
    image_slide_movil:{
      type:String,
      required:false
    },
    status:{
        type:Boolean,
        required:false,
        default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const BannerModel = mongoose.model<BannerEntity>(
    'Banners',
    BannerSchema
  );
  
  export default BannerModel;
  
