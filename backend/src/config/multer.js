import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function multer_config(allowedTypes) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const email = req.session?.user?.email;
            if (!email) {
                return cb(new Error("User email not found in session"));
            }
            const uploadDir = path.join(__dirname, `../uploads/${email}`);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const originalName = file.originalname;
            cb(null, `${originalName}`);
        }
    });

    const filter = (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'), false);
        }
    };

    return multer({
        storage,
        fileFilter: filter,
        limits: { fileSize: 500 * 1024 * 1024 },
    });
}

export default multer_config;