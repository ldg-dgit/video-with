import express from "express";

import { trendingVideos, search } from "../controllers/videoController";
import { signup, signin } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", trendingVideos);
globalRouter.get("/signup", signup);
globalRouter.get("/signin", signin);
globalRouter.get("/search", search);

export default globalRouter;
