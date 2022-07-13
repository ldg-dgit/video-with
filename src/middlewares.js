import multer from "multer";

export const localMiddleware = (req, res, next) => {
  res.locals.signin = Boolean(req.session.signin);
  res.locals.signinUser = req.session.user;
  console.log(res.locals);
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.signin) {
    next();
  } else {
    return res.redirect("/signin");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.signin) {
    return next();
  } else {
    return res.redirect("/user/my-profile");
  }
};

export const profilePictureUpload = multer({ dest: "upload/profile_picture/", limits: { fileSize: 10000000 } });
export const videoUpload = multer({ dest: "upload/video/", limits: { fileSize: 50000000 } });
