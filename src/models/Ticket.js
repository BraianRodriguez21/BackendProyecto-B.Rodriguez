import mongoose from 'mongoose';
const { Schema } = mongoose;

const ticketSchema = new Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

export const Ticket = mongoose.model('Ticket', ticketSchema);
