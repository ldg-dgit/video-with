export const localMiddleware = (req, res, next) => {
  res.locals.signin = Boolean(req.session.signin);
  res.locals.signinUser = req.session.user;
  console.log(res.locals);
  next();
};
