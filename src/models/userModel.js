import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
    
    documents: [
        {
            name: { type: String, required: true },
            reference: { type: String, required: true },
        }
    ],

    last_connection: { type: Date }
});

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
