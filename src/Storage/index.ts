import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Set up storage engine
export const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Check File Type
export const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback) => {
    console.log(file);
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
};

// Initialize upload
export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
}).single('image');
