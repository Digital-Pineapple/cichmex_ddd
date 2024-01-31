import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { SubCategory } from '../../domain/subCategory/SubCategoryEntity';
import MongooseDelete = require("mongoose-delete");


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

      }
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  SubCategorySchema.plugin(MongooseDelete, {overrideMethods:true})

  const SubCategoryModel = model("SubCategory", SubCategorySchema);
  export default SubCategoryModel