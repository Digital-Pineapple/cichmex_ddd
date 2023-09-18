import { Schema, model } from 'mongoose';
import { CarDetail } from '../../domain/carDetail/CarDetailEntity';

const CarDetailSchema = new Schema<CarDetail>(
    {
      brand: {
        type: String,
        required: true,
      },
      model:{
        type: String,
        required:true,
      },
      version:{
        type: String,
        required: true,

      },
      carDetail_image:{
        type: String,
        required: false,
      },
      plate_number:{
        type:String,
        required:true,
      },
      status: {
        status:Boolean,
        required: true,
    }
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );

  const CarDetailModel = model('CarDetailModel', CarDetailSchema);

  export default CarDetailModel;