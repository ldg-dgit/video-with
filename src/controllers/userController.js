import User from "../models/User";

export const signupGet = (req, res) => res.render("signup", { bodyTitle: "Sign Up", headTitle: "Sign Up" });
export const signupPost = async (req, res) => {
  const { name, username, email, password, location } = req.body;
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
