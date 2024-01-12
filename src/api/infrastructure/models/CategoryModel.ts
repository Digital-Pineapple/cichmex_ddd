import { Schema, model } from 'mongoose';
import { Category } from '../../domain/category/CategoryEntity';
import MongooseDelete = require("mongoose-delete");



const CategorySchema = new Schema<Category>(
    {
      name: {
        type: String,
        required: true,
      },
      category_image:{
        type: String,
        required: false,
      }
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  CategorySchema.plugin(MongooseDelete,{overrideMethods:true})

  const CategoryModel = model<Document & Category>('Categories', CategorySchema);

  export default CategoryModel;