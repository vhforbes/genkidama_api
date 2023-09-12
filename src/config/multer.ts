import multer from 'multer';
import path from 'path';

const storageConfig = multer.diskStorage({
  destination: '../uploads/',
  filename: (
    req,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

export default storageConfig;
