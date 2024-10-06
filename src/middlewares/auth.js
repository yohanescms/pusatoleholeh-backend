import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const ruteAman = async (req, res, next) => {
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
        return res.status(403).json({ message: 'role ga valid' });
    }
    next();
};