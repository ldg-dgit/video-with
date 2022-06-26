import express from "express";

import { home } from "../controllers/videoController";
import { signup, signin } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/signup", signup);
globalRouter.get("/signin", signin);

export default globalRouter;
