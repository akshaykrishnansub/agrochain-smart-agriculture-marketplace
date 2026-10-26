import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
const uploadFile = async (file) => {
    const key = `uploads/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    });
    await s3.send(command);
    return {
        fileName: file.originalname,
        fileKey: key
    };
};
const getFileUrl = (fileKey) => {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
};
export { uploadFile, getFileUrl };
//# sourceMappingURL=fileServices.js.map