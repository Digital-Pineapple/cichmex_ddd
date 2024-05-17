import { Schema, model } from 'mongoose';
import { Category } from '../../domain/category/CategoryEntity';



const CategorySchema = new Schema<Category>(
    {
      name: {
        type: String,
        required: true,
      },
      category_image:{
        type: String,
        required: false,
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


  const CategoryModel = model<Category>('Categories', CategorySchema);

  export default CategoryModel;