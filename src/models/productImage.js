import mongoose from 'mongoose';

const productPicturesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  url: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
});

const ProductPictures = mongoose.model('ProductPictures', productPicturesSchema);
export default ProductPictures;
