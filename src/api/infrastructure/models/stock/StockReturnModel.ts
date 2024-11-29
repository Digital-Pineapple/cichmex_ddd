import mongoose, { model, Schema } from "mongoose";
import { IProductReturn } from '../../../domain/stockBranch/StockBranchEntity';

// Definición del esquema para devoluciones de stock
const StockReturnSchema1 = new Schema<IProductReturn>({
    stock_id: {
        type: mongoose.Types.ObjectId,
        ref: 'stockinbranches', // Referencia al modelo 'stockinbranches'
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    newQuantity: {
        type: Number,
        required: true,
    },
    responsible_id: {
        type: mongoose.Types.ObjectId,
        ref: 'customers', // Referencia al modelo 'customers'
        required: true,
    },
    status: {
        type: Boolean,
        default: true, // Establece el valor predeterminado a `true`
    }
}, {
    timestamps: true, // Añadir createdAt y updatedAt automáticamente
    versionKey: false, // Deshabilitar la versión de documento (v)
});

// Creación del modelo de Mongoose con el esquema definido
const StockReturnModel = model<IProductReturn>('StockReturns', StockReturnSchema1);

export default StockReturnModel;
