import jwt from 'jsonwebtoken';

export const ruteAman = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];        
    }
    if (!token) return res.status(401).json({message: "minggir lu miskin, lu gaada token"});

    try {
        const decoded = jwt.verify(token, 'JWT_SECRET');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'token lu ga valid goblok!'});
    }
};

export const gwejhSelller = (req, res, next) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'token lu gabisa dipake disini!'});
    }
    next();
};

export const gwejhBuyer = (req, res, next) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).json({ message: 'token lu gabisa dipake disini!'});
    }
    next();
};

export const gwejhAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'token lu gabisa dipake disini!'});
    }
    next();
};