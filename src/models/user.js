import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    address: {
        province: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        subdistrict: { type: String, required: true },
        postalCode: { type: Number }
    },
    phoneNumber: { type: String },
    isBanned: { type: Boolean, default: false },
    googleId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);