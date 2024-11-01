import Discuss from '../models/discuss.js';
import Product from '../models/product.js';
import { validationResult } from 'express-validator';

export const addDiscuss = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { chat, replyId } = req.body;
        const { productId } = req.params;
        const userId = req.user._id;

        const product = await Product.findById(productId);

        if (!product) {
        return res.status(404).json({ message: 'Product not found' });
        }
        
        const discuss = new Discuss({
            chat,
            replyId: replyId ? replyId: null,
            userId,
            productId,
        });

        await discuss.save();
        
        res.status(201).json({ message: 'Discussion added successfully', discuss });
      } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
      }
};

export const updateDiscuss = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { chat } = req.body;
        const { discussId } = req.params;
        const userId = req.user._id;

        const discuss = await Discuss.findOne({ _id: discussId, userId });

        if (!discuss) {
        return res.status(404).json({ message: 'Your chat is not found' });
        }

        discuss.chat = chat;
        discuss.updatedAt = Date.now();

        await discuss.save();
        
        res.status(200).json({ message: 'Discussion update successfully', discuss });
      } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
      }
};

export const deleteDiscuss = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { discussId } = req.params;
        const userId = req.user._id;

        const discuss = await Discuss.findOne({ _id: discussId, userId });

        if (!discuss) {
        return res.status(404).json({ message: 'Your chat is not found' });
        }

        discuss.deleted = true;
        discuss.updatedAt = Date.now();

        await discuss.save();
        
        res.status(200).json({ message: 'Discussion deleted successfully', discuss });
      } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
      }
};

export const getDiscussionByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const discussions = await Discuss.find({ productId, deleted: false })
            .populate('userId', 'username')
            .populate({
                path: 'replyId',
                match: { deleted: false },
                populate: { path: 'userId', select: 'username' },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ discussions });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }  
};