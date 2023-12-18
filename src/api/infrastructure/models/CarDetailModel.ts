import { Schema, model } from 'mongoose';
import { CarDetail } from '../../domain/carDetail/CarDetailEntity';

const CarDetailSchema = new Schema<CarDetail>(
    {
      customer_id :{
        type: Schema.Types.ObjectId,
            ref: 'Customer'
      },
      typeCar_id: {
        type: Schema.Types.ObjectId,
        ref: 'typeCar_id'
      },
      carDetail_image:{
        type: String,
        required: false,
      },
      status: {
        type: Boolean,
        default:true,
    },
      plate_number:{
        type:String,
        required:true,
      },
      
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );

  const CarDetailModel = model('CarDetailModel', CarDetailSchema);

  export default CarDetailModel;