import multer from "multer";
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type"));
    }
};
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});
export default upload;
//# sourceMappingURL=upload.middleware.js.map