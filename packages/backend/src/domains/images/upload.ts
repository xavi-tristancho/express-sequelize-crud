import { Router } from "express";
import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-west-1",
});

const s3 = new AWS.S3();

const router = Router();

if (
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_BUCKET_NAME
) {
  const upload = multer({
    storage: multerS3({
      // @ts-ignore
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME!,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        cb(null, Date.now().toString() + "-" + file.originalname);
      },
      acl: "public-read",
    }),
  });

  // Define the Express endpoint for uploading images
  router.post("/upload", upload.single("image"), (req, res) => {
    // @ts-ignore
    res.json({ url: req.file?.location });
  });
}

export default router;
