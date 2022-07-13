import express from "express";
import { videoWatch, videoEditGet, videoEditPost, videoUploadGet, videoUploadPost, videoDeleteGet } from "../controllers/videoController";
import { protectorMiddleware, publicOnlyMiddleware, videoUpload } from "../middlewares.js";

const videoRouter = express.Router();

videoRouter.route("/upload").all(protectorMiddleware).get(videoUploadGet).post(videoUpload.single("video"), videoUploadPost);

videoRouter.route("/:id([0-9a-f]{24})").get(videoWatch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(videoEditGet).post(videoEditPost);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(videoDeleteGet);

export default videoRouter;
