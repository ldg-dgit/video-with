import Video from "../models/Video.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");
    return res.render("home", { bodyTitle: "Home", headTitle: "Home", videos });
  } catch {
    return res.render("server-error", { error });
  }
};

export const videoWatch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { bodyTitle: "404 - Not Found", headTitle: "404 - Not Found" });
  }
  return res.render("video_watch", {
    headTitle: `${video.title}`,
    bodyTitle: `${video.title}`,
    video,
  });
};

export const videoEditGet = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404", { bodyTitle: "404 - Not Found", headTitle: "404 - Not Found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("video_edit", {
    headTitle: `Edit - ${video.title}`,
    bodyTitle: `Edit - ${video.title}`,
    video,
  });
};

export const videoEditPost = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404", { bodyTitle: "404 - Not Found", headTitle: "404 - Not Found" });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved");
  return res.redirect(`/video/${id}`);
};

export const videoUploadGet = (req, res) => {
  return res.render("upload", { headTitle: `Upload Video`, bodyTitle: `Upload Video` });
};

export const videoUploadPost = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video } = req.file;
  const { title, description, hashtags } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await Video.create({
      title,
      description,
      owner: _id,
      video: isHeroku ? video.location : video.path,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      headTitle: `Upload Video`,
      bodyTitle: `Upload Video`,
      errorMessage: error._message,
    });
  }
};

export const videoDeleteGet = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { bodyTitle: "404 - Not Found", headTitle: "404 - Not Found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { headTitle: `Search`, bodyTitle: `Search`, videos });
};

export const viewCount = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.sendStatus(201);
};
