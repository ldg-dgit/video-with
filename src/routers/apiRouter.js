import express from "express";

import { viewCount, createComment } from "../controllers/videoController.js";

const apiRouter = express.Router();

apiRouter.post("/video/:id[0-9a-f]{24}/view/end", viewCount);
apiRouter.post("/video/:id[0-9a-f]{24}/comment", createComment);

export default apiRouter;
