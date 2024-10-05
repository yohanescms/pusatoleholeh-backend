import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Shop', shopSchema);