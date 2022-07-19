import express from "express";
import {
  userEditGet,
  userEditPost,
  userDelete,
  signout,
  userProfile,
  signWithGithub,
  githubCallback,
  userEditPasswordGet,
  userEditPasswordPost,
} from "../controllers/userController.js";
import { protectorMiddleware, publicOnlyMiddleware, profilePictureUpload } from "../middlewares.js";

const userRouter = express.Router();

userRouter.get("/signout", protectorMiddleware, signout);
userRouter.route("/edit").all(protectorMiddleware).get(userEditGet).post(profilePictureUpload.single("profile_picture"), userEditPost);
userRouter.route("/edit/password").all(protectorMiddleware).get(userEditPasswordGet).post(userEditPasswordPost);
userRouter.get("/delete", userDelete);
userRouter.get("/github/sign", publicOnlyMiddleware, signWithGithub);
userRouter.get("/github/callback", publicOnlyMiddleware, githubCallback);

userRouter.get("/:id", userProfile);

export default userRouter;
