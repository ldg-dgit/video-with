import User from "../models/User";
import fetch from "cross-fetch";
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
  const user = await User.findOne({ email, ssoOnly: false });
  if (!user) {
    return res.status(400).render("signin", { bodyTitle, headTitle, errorMessage: "An account with this email does not exists." });
  }
  const exists = await bcrypt.compare(password, user.password);
  if (!exists) {
    return res.status(400).render("signin", { bodyTitle, headTitle, errorMessage: "Wrong password." });
  }
  req.session.signin = true;
  req.session.user = user;
  res.redirect("/");
};
export const signWithGithub = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const Url = `${baseUrl}?${params}`;
  return res.redirect(Url);
};
export const githubCallback = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const Url = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(Url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(emailData);
    const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
    if (!emailObj) {
      return res.redirect("/signin");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        avatarUrl: userData.avatar_url,
        ssoOnly: true,
        githubId: userData.id,
        email: emailObj.email,
        password: "",
        location: userData.location,
      });
    }
    req.session.signin = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/signin");
  }
};

export const userEditGet = (req, res) => {
  return res.render("edit-profile", { bodyTitle: "Edit Profile", headTitle: "Edit Profile" });
};
export const userEditPost = async (req, res) => {
  const {
    session: {
      user: { _id, email: pastEmail },
    },
    body: { name, email, location },
  } = req;
  /*
  Check Exist Email (Duplication Checker)
  if (email !== pastEmail) {
    const checkEmail = await User.exists({ email });
    if (checkEmail) {
      return res.status(400).render("edit-profile", {
        bodyTitle: "Edit Profile",
        headTitle: "Edit Profile",
        errorMessage: "This email is already taken",
      });
    }
  }
  */
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/user/edit");
};
export const userDelete = (req, res) => res.send("Delete User");
export const signout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const userProfile = (req, res) => {
  return res.send(`User Profile @${req.params.id}`);
};
