import User from "../models/User";
import bcrypt from "bcrypt";

export const signupGet = (req, res) => res.render("signup", { bodyTitle: "Sign Up", headTitle: "Sign Up" });
export const signupPost = async (req, res) => {
  const headTitle = "Sign Up";
  const bodyTitle = "Sign Up";

  const { name, username, email, password, passwordConfirm, location } = req.body;
  const dupcheck = await User.exists({ $or: [{ username }, { email }] });
  if (password !== passwordConfirm) {
    return res.status(400).render("signup", { bodyTitle, headTitle, errorMessage: "Password confirmation does not match." });
  }
  if (dupcheck) {
    return res.status(400).render("signup", { bodyTitle, headTitle, errorMessage: "This username/email is already taken." });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/signin");
  } catch (error) {
    return res.status(400).render("signup", { headTitle, bodyTitle, errorMessage: error._message });
  }
};
export const signinGet = (req, res) => {
  const headTitle = "Sign In";
  const bodyTitle = "Sign In";

  res.render("signin", { bodyTitle, headTitle });
};
export const signinPost = async (req, res) => {
  const headTitle = "Sign In";
  const bodyTitle = "Sign In";
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).render("signin", { bodyTitle, headTitle, errorMessage: "An account with this email does not exists." });
  }
  const exists = await bcrypt.compare(password, user.password);
  if (!exists) {
    return res.status(400).render("signin", { bodyTitle, headTitle, errorMessage: "Wrong password." });
  }
  res.redirect("/");
};
export const userEdit = (req, res) => res.send("Edit User");
export const userDelete = (req, res) => res.send("Delete User");
export const signout = (req, res) => res.send("Sign Out");
export const userProfile = (req, res) => {
  return res.send(`User Profile @${req.params.id}`);
};
