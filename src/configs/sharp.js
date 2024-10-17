import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const saveAsWebp = async (file, uploadPath) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const webpFilename = `${uniqueSuffix}.webp`;
  const webpFilePath = path.join(uploadPath, webpFilename);

  fs.mkdirSync(uploadPath, { recursive: true });

  await sharp(file.buffer)
    .webp({ quality: 80 })
    .toFile(webpFilePath);

  return {
    filename: webpFilename,
    path: webpFilePath,
    url: `${uploadPath}/${webpFilename}`,
  };
};

export default saveAsWebp;
