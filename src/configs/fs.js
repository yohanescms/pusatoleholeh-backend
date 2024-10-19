import fs from 'fs';

export const uploadPathCheck = (uploadPath) => {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
};