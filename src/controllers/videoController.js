import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { bodyTitle: "Home", headTitle: "Home", videos });
  } catch {
    return res.render("server-error", { error });
  }
};

export const videoWatch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const owner = await User.findById(video.owner);
  if (!video) {
    return res.render("404", { bodyTitle: "404 - Not Found", headTitle: "404 - Not Found" });
  }
  return res.render("video_watch", { headTitle: `${video.title}`, bodyTitle: `${video.title}`, video, owner });
};

export const videoEditGet = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { bodyTitle: "404 - Not Found", headTitle: "404 - Not Found" });
  }
  return res.render("video_edit", { headTitle: `Edit - ${video.title}`, bodyTitle: `Edit - ${video.title}`, video });
};

export const videoEditPost = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render("404", { bodyTitle: "404 - Not Found", headTitle: "404 - Not Found" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/video/${id}`);
};

export const videoUploadGet = (req, res) => {
  return res.render("upload", { headTitle: `Upload Video`, bodyTitle: `Upload Video` });
};

export const videoUploadPost = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { path: videoPath } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      videoPath,
      title,
      description,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", { headTitle: `Upload Video`, bodyTitle: `Upload Video`, errorMessage: error._message });
  }
};

export const videoDeleteGet = async (req, res) => {
  const { id } = req.params;
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
    });
  }
  return res.render("search", { headTitle: `Search`, bodyTitle: `Search`, videos });
};
