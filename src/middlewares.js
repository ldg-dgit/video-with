export const localMiddleware = (req, res, next) => {
  res.locals.signin = Boolean(req.session.signin);
  res.locals.signinUser = req.session.user;
  console.log(res.locals);
  next();
};

export const protextorMiddleware = (req, res, next) => {
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
