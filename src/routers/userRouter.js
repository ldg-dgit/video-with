import express from "express";
import { userEdit, userDelete, signout, userProfile, signWithGithub, githubCallback } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/signout", signout);
userRouter.get("/edit", userEdit);
userRouter.get("/delete", userDelete);
userRouter.get("/github/sign", signWithGithub);
userRouter.get("/github/callback", githubCallback);

userRouter.get("/:id", userProfile);

export default userRouter;
