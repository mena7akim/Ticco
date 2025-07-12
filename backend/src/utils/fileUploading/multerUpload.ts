import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${nanoid()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export default upload;
