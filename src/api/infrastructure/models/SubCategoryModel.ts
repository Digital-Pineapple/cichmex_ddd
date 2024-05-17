import { Schema, model } from 'mongoose';
import { SubCategory } from '../../domain/subCategory/SubCategoryEntity';


const SubCategorySchema = new Schema<SubCategory>(
    {
      name: {
        type: String,
        required: true,
      },
      subCategory_image:{
        type: String,
        required: false,
      },
      category_id:{
        type: Schema.Types.ObjectId, 
        ref:'Categories'

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

  const SubCategoryModel = model("SubCategory", SubCategorySchema);
  export default SubCategoryModel