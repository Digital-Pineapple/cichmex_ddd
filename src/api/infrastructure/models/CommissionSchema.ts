import { Schema, model } from 'mongoose';

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
        type:Boolean,
        required:false,
        default:true,
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