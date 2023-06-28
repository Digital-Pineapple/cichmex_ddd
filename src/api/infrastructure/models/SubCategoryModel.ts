import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Subcategory } from '../../domain/category/Category';

const SubCategorySchema = new Schema<Subcategory>(
    {
      name: {
        type: String,
        required: true,
      },
      desription:{ 
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

  const SubCategory = model("SubCategory", SubCategorySchema);