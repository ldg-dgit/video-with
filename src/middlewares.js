import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const multerS3ImageUploader = multerS3({
  s3: s3,
  bucket: "video-with/image",
  Condition: {
    StringEquals: { "s3:x-amz-acl": ["public-read"] },
  },
});

const multerS3VideoUploader = multerS3({
  s3: s3,
  bucket: "video-with/video",
  Condition: {
    StringEquals: { "s3:x-amz-acl": ["public-read"] },
  },
});

export const localMiddleware = (req, res, next) => {
  res.locals.signin = Boolean(req.session.signin);
  res.locals.siteName = "Video with";
  res.locals.signinUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.signin) {
    next();
  } else {
    req.flash("error", "Not Authorized");
    return res.redirect("/signin");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.signin) {
    return next();
  } else {
    req.flash("error", "Not Authorized");
    return res.redirect("/");
  }
};

export const profilePictureUpload = multer({
  dest: "upload/profile_picture/",
  limits: { fileSize: 10000000 },
  storage: isHeroku ? multerS3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "upload/video/",
  limits: { fileSize: 50000000 },
  storage: isHeroku ? multerS3VideoUploader : undefined,
});
