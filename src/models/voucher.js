import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  quantity: { type: Number, required: true, min: 0 }, 
  discount: { 
    type: Number, 
    required: true, 
    min: 0,
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Discount must be greater than 0.'
    }
  }, 
  minPurchase: { type: Number, default: 0 }, 
  expired: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Voucher', voucherSchema);