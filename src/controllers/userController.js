import User from "../models/User.js";
import fetch from "cross-fetch";
import bcrypt from "bcrypt";

export const signupGet = (req, res) =>
  res.render("signup", { bodyTitle: "Sign Up", headTitle: "Sign Up" });
export const signupPost = async (req, res) => {
  const headTitle = "Sign Up";
  const bodyTitle = "Sign Up";

  const { name, username, email, password, passwordConfirm, location } = req.body;
  const dupcheck = await User.exists({ $or: [{ username }, { email }] });
  if (password !== passwordConfirm) {
    return res.status(400).render("signup", {
      bodyTitle,
      headTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  if (dupcheck) {
    return res.status(400).render("signup", {
      bodyTitle,
      headTitle,
      errorMessage: "This username/email is already taken.",
    });
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
    return res.status(400).render("signin", {
      bodyTitle,
      headTitle,
      errorMessage: "An account with this email does not exists.",
    });
  }
  const exists = await bcrypt.compare(password, user.password);
  if (!exists) {
    return res
      .status(400)
      .render("signin", { bodyTitle, headTitle, errorMessage: "Wrong password." });
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
        profilePicturePath: userData.avatar_url,
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
      user: { _id, profilePicturePath },
    },
    body: { name, email, location },
    file,
  } = req;
  const isHeroku = process.env.NODE_ENV === "production";
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      profilePicturePath: file ? (isHeroku ? file.location : file.path) : profilePicturePath,
      name,
      email,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/user/edit");
};
export const userEditPasswordGet = (req, res) => {
  if (req.session.user.ssoOnly === true) {
    req.flash("error", "Can't change password. (SSO account)");
    return res.redirect("/");
  }
  return res.render("user/edit-password.pug", {
    bodyTitle: "Change User Password",
    headTitle: "Change User Password",
  });
};
export const userEditPasswordPost = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPwd, newPwd, newPwdConf },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPwd, password);
  if (!ok) {
    return res.status(400).render("user/edit-password.pug", {
      bodyTitle: "Change User Password",
      headTitle: "Change User Password",
      errorMessage: "The current password does not match.",
    });
  }
  if (newPwd !== newPwdConf) {
    return res.status(400).render("user/edit-password.pug", {
      bodyTitle: "Change User Password",
      headTitle: "Change User Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  user.password = newPassword;
  await user.save();
  req.flash("info", "Password updated");
  req.session.user.password = user.password;
  return redirect("/user/my-profile");
};
export const userDelete = (req, res) => res.send("Delete User");
export const signout = (req, res) => {
  req.flash("info", "Bye!!");
  req.session.destroy();
  return res.redirect("/");
};
export const userProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res
      .status(404)
      .render("404", { bodyTitle: `User Not Found`, headTitle: `User Not Found` });
  }
  return res.render("user/profile", {
    bodyTitle: `${user.name}'s Profile`,
    headTitle: `${user.name}`,
    user,
  });
};
