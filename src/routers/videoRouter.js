import express from "express";
import { videoWatch, videoEditGet, videoEditPost, videoUploadGet, videoUploadPost, videoDeleteGet } from "../controllers/videoController";
import { protextorMiddleware, publicOnlyMiddleware } from "../middlewares.js";

const videoRouter = express.Router();

videoRouter.route("/upload").all(protextorMiddleware).get(videoUploadGet).post(videoUploadPost);

videoRouter.route("/:id([0-9a-f]{24})").get(videoWatch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protextorMiddleware).get(videoEditGet).post(videoEditPost);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protextorMiddleware).get(videoDeleteGet);

export default videoRouter;
