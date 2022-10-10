import multer from "multer";
import path from "path";

const tmpPath = path.resolve(__dirname, "..", "..", "tmp");

export default {
  tmpPath,
  storage: multer.diskStorage({
    destination: (req, res, callback) => {
      callback(null, path.resolve(__dirname, "..", "..", "tmp"));
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = `${
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname
      }`;
      callback(null, file.fieldname + "-" + uniqueSuffix);
    },
  }),
};
