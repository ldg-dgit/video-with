import express from "express";
import { userEditGet, userEditPost, userDelete, signout, userProfile, signWithGithub, githubCallback } from "../controllers/userController";
import { protextorMiddleware, publicOnlyMiddleware } from "../middlewares.js";

const userRouter = express.Router();

userRouter.get("/signout", protextorMiddleware, signout);
userRouter.route("/edit").all(protextorMiddleware).get(userEditGet).post(userEditPost);
userRouter.get("/delete", userDelete);
userRouter.get("/github/sign", publicOnlyMiddleware, signWithGithub);
userRouter.get("/github/callback", publicOnlyMiddleware, githubCallback);

userRouter.get("/:id", userProfile);

export default userRouter;
