import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'profile' ? 'profiles' : 
                        file.fieldname === 'product' ? 'products' : 'documents';
        cb(null, path.join(__dirname, `../uploads/${folder}`));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

export default upload;
