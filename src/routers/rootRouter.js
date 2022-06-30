import express from "express";

import { home, search } from "../controllers/videoController";
import { signupGet, signupPost, signinGet, signinPost } from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/signup").get(signupGet).post(signupPost);
rootRouter.route("/signin").get(signinGet).post(signinPost);
rootRouter.get("/search", search);

export default rootRouter;
