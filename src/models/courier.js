import mongoose from 'mongoose';

const courierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  receiptSecret: { type: String, required: true },
  cost: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Courier', courierSchema);