import mongoose, { Schema } from "mongoose";

const CounterSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    id: {type: String},
    sequence_value: { type: Number , default: 0}
})

export const CounterModel = mongoose.model('Counter', CounterSchema)