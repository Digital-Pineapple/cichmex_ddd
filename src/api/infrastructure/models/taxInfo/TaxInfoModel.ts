import mongoose, { model, Schema } from "mongoose";
import { ITaxInfoEntity } from "../../../domain/taxInfo/TaxInfoEntity";

const TaxAddressSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
    },
    exterior: {
      type: Number,
      required: true,
    },
    interior: {
      type: Number,
      required: false, // Campo opcional
    },
    neighborhood: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    municipality: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Evita crear un `_id` para el subdocumento
);

const TaxInfoSchema = new Schema<ITaxInfoEntity>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Refiere al modelo de usuario
      required: true,
    },
    legal_name: {
      type: String,
      required: true,
    },
    tax_id: {
      type: String,
      required: true,
    },
    tax_system: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: false,
      match: /^\S+@\S+\.\S+$/, // Validación básica de correo
    },
    phone: {
      type: Number,
      required: false,
    },
    default_invoice_use: {
      type: String,
      required: false,
    },
    address: {
      type: TaxAddressSchema, // Subdocumento
      required: true,
    },
    status: {
      type: Boolean,
      default: true, // Por defecto, está activo
    },
    facturapi_id: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false, // Omite el campo `__v`
    timestamps: true, // Agrega `createdAt` y `updatedAt`
  }
);

const TaxInfoModel = model("TaxInfo", TaxInfoSchema);

export default TaxInfoModel;
