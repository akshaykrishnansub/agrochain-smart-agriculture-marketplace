import { S3Client } from "@aws-sdk/client-s3";
const s3 = new S3Client({
    region: process.env.AWS_REGION
});
export default s3;
//# sourceMappingURL=s3.js.map