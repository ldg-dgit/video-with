import express from "express";

import { home, search } from "../controllers/videoController";
import { signupGet, signupPost, signin } from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/signup").get(signupGet).post(signupPost);
rootRouter.get("/signin", signin);
rootRouter.get("/search", search);

export default rootRouter;
