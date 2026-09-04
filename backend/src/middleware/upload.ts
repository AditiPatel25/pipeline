import multer, { memoryStorage } from 'multer';

const storage = memoryStorage();

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

export const resumeUpload = upload.single('resume');