import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const CommissionSchema = new Schema<CommissionEntity>(
    {
      name: {
        type: String,
        required: true,
      },
      amount:{
        type: Number,
        required:true,
      },
      status:{
        type: Boolean,
        required: true,
      },
      discount:{
        type: Number,
        required: true

      }
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );

  const CommissionModel = model('CommissionModel', CommissionSchema);

  export default CommissionModel;