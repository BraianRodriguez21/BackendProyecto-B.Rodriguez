import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = '';

        if (file.fieldname === 'profile') {
            folder = 'profiles';
        } else if (file.fieldname === 'product') {
            folder = 'products';
        } else if (file.fieldname === 'document') {
            folder = 'documents';
        }

        cb(null, path.join(__dirname, `../uploads/${folder}`));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({ storage: storage });
