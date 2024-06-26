import { User } from '../models/userModel.js';

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const findUserById = async (id) => {
    return await User.findById(id);
};

export const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};
