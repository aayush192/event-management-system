import multer from "multer";
import apiError from "../utils/apiError";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export const upload = multer({
    storage: storage,
    limits:{fileSize:1000000},
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            throw new apiError(400,`invalid file type`)
        }
    }
});
