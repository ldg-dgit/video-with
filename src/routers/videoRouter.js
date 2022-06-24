import express from "express";
import { videoWatch, videoEdit, videoUpload, videoDelete } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", videoUpload);

videoRouter.get("/:id", videoWatch);
videoRouter.get("/:id/edit", videoEdit);
videoRouter.get("/:id/delete", videoDelete);

export default videoRouter;
