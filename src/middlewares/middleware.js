import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const safeRoute = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];        
    }
    if (!token) return res.status(401).json({message: "minggir lu miskin, lu gaada token"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'Invalid token, user not found.' });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'token lu ga valid kocag!'});
    }
};

export const verifyRole = (...allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'invalid role' });
    }
    next();
};

export const checkShopOwner = async (req, res, next) => {
    const { shopId } = req.body;
    const shop = await Shop.findById(shopId);

    if (!shop || String(shop.ownerId) !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not have permission to modify this shop\'s products.' });
    }
    next();
};