import Usage from '../models/usage.js';

export const productTrack = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const endpoint = `GET /product/${productId}`;
      const productIds = productId;

      const usageEntry = await Usage.findOne({ endpoint });
  
      if (usageEntry) {
        await Usage.updateOne({ endpoint }, { $inc: { count: 1 } });
      } else {
        await Usage.create({ endpoint, productId: productIds, count: 1 });
      }
  
      next();
    } catch (error) {
      console.error('Error tracking:', error);
      next();
    }
  };