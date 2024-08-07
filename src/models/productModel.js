import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    owner: { type: String, default: 'admin' }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
