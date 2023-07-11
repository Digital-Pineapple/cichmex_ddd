import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { SubCategory } from '../../domain/subCategory/SubCategoryEntity';

const SubCategorySchema = new Schema<SubCategory>(
    {
      name: {
        type: String,
        required: true,
      },
      description:{ 
      type: String,
      required: true,
      },
      status:{
        type: Boolean,
        required: true,
      },
      category:{
        type: Schema.Types.ObjectId,
        ref:'Category'

      }
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );

  const SubCategoryModel = model("SubCategory", SubCategorySchema);
  export default SubCategoryModel