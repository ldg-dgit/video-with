import express from "express";

import { viewCount } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/video/:id[0-9a-f]{24/view", viewCount);

export default apiRouter;
