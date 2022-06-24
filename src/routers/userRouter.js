import express from "express";
import { userEdit, userDelete, signout, userProfile } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/signout", signout);
userRouter.get("/edit", userEdit);
userRouter.get("/delete", userDelete);

userRouter.get("/:id", userProfile);

export default userRouter;
