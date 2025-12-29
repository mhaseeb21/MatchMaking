const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuid } = require("uuid");


console.log("AWS Access Key:", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS Secret Key loaded:", !!process.env.AWS_SECRET_ACCESS_KEY);
console.log("AWS Region:", process.env.AWS_REGION);


const s3 = new S3Client({
  region: process.env.AWS_REGION,
    credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
  // 👇 NO credentials here on purpose
});

exports.uploadToS3 = async (file) => {
  const fileKey = `users/${uuid()}-${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
};
