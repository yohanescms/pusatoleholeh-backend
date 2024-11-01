import Product from '../models/product.js';
import ProductCover from '../models/productCover.js';
import Shop from '../models/shop.js';
import ShopImage from '../models/shopImage.js';
import Category from '../models/category.js';

export const search = async (req, res) => {
    try {
        const { st, q } = req.query;

        if (!st || !q) {
            return res.status(400).json({ message: 'Both search type (st) and query (q) are required' });
        }

        let results = [];

        if (st === 'product') {
            results = await Product.find(
                { $text: { $search: q }, isActive: true },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .populate('categoryId', 'name')
            .populate('shopId', 'name address')
            .lean();

            const productIds = results.map(product => product._id);
            const productCovers = await ProductCover.find({ productId: { $in: productIds } });

            results = results.map(product => {
                const cover = productCovers.find(cover => cover.productId.toString() === product._id.toString());
                return {
                    ...product,
                    productCover: cover ? cover.url : null
                };
            });

        } else if (st === 'shop') {
            results = await Shop.find(
                { $text: { $search: q } },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .lean();

            const shopIds = results.map(shop => shop._id);
            const shopImages = await ShopImage.find({ shopId: { $in: shopIds } });

            results = results.map(shop => {
                const image = shopImages.find(img => img.shopId.toString() === shop._id.toString());
                return {
                    ...shop,
                    shopImage: image ? image.url : null
                };
            });
        } else {
            return res.status(400).json({ message: 'Invalid search type. Use "product" or "shop".' });
        }

        res.status(200).json({ results });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};