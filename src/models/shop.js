import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    address: {
        province: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        subdistrict: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Shop', shopSchema);