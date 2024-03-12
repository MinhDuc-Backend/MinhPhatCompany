import multer from "multer"
import fs from 'fs'
import path from 'path';
const uploadPath = 'public';

function isImageFile(file) {
    // Kiểm tra loại MIME của file
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (mimeTypes.includes(file.mimetype)) {
        return true;
    }
    return false;
}
function fileFilter(req, file, cb) {
    if (isImageFile(file)) {
        cb(null, true);
    } else {
        cb(new Error('File must be an image. Please choose a valid image file.'));
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./public/${req.dirName}/`)
    },
    filename: (req, file, cb) => {
        let part = file.fieldname
        if (file.fieldname == 'file') {
            part = file.fieldname + Date.now();
        }
        cb(null, part)
    }
})

const storageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./public/${req.dirName}/`)
    },
    filename: (req, file, cb) => {
        let part = file.originalname
        cb(null, part)
    }
})

export const uploadImg = multer({ storage: storage })
export const uploadFile = multer({ storage: storageFile })