import User from "../models/User";

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
  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  return res.redirect("/signin");
};
export const userEdit = (req, res) => res.send("Edit User");
export const userDelete = (req, res) => res.send("Delete User");
export const signin = (req, res) => res.render("signin");
export const signout = (req, res) => res.send("Sign Out");
export const userProfile = (req, res) => {
  return res.send(`User Profile @${req.params.id}`);
};
