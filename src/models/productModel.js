import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    title: { type: String }, 
    price: { type: Number, required: true },
    description: { type: String }, 
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: 'admin' } 
});

const Product = mongoose.model('Product', productSchema);

export default Product;
