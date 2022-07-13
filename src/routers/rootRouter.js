import express from "express";

import { home, search } from "../controllers/videoController";
import { signupGet, signupPost, signinGet, signinPost } from "../controllers/userController";
import { protextorMiddleware, publicOnlyMiddleware } from "../middlewares.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/signup").all(publicOnlyMiddleware).get(signupGet).post(signupPost);
rootRouter.route("/signin").all(publicOnlyMiddleware).get(signinGet).post(signinPost);
rootRouter.get("/search", search);

export default rootRouter;
