import express from "express";
import { videoWatch, videoEditGet, videoEditPost, videoUploadGet, videoUploadPost } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(videoUploadGet).post(videoUploadPost);

videoRouter.route("/:id([0-9a-f]{24})").get(videoWatch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(videoEditGet).post(videoEditPost);

export default videoRouter;
