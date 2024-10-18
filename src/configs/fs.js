import fs from 'fs';

const uploadPathCheck = (uploadPath) => {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
};

export default uploadPathCheck;