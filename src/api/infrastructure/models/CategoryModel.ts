import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Category } from '../../domain/category/Category';

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
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );

  const CategoryModel = model('CategoryModel', CategorySchema);

  export default CategoryModel;