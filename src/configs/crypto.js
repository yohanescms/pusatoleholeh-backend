import crypto from 'crypto';

export const encodeFileName = (originalName, prefix = 'image') => {
    const hash = crypto.createHash('sha256').update(originalName + Date.now()).digest('hex');
    return `${prefix}-${hash}.webp`;
};
