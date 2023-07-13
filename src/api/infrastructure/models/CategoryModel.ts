import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Category } from '../../domain/category/CategoryEntity';

const CategorySchema = new Schema<Category>(
    {
      name: {
        type: String,
        required: true,
      },
      description:{
        type: String,
        required:true,
      },
      status:{
        type: Boolean,
        required: true,

      },
      category_image:{
        type: String,
        required: true,
      }
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );

  const CategoryModel = model('CategoryModel', CategorySchema);

  export default CategoryModel;