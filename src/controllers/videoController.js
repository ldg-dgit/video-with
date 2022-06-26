import Video, { formatHashtags } from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { bodyTitle: "Home", headTitle: "Home", videos });
  } catch {
    return res.render("server-error", { error });
  }
};

export const videoWatch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { bodyTitle: "404 - Not Found", headTitle: "404 - Not Found" });
  }
  return res.render("video_watch", { headTitle: `${video.title}`, bodyTitle: `${video.title}`, video });
};

export const videoEditGet = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { bodyTitle: "404 - Not Found", headTitle: "404 - Not Found" });
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
    hashtags: formatHashtags(hashtags),
  });
  return res.redirect(`/video/${id}`);
};

export const videoUploadGet = (req, res) => {
  return res.render("upload", { headTitle: `Upload Video`, bodyTitle: `Upload Video` });
};

export const videoUploadPost = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", { headTitle: `Upload Video`, bodyTitle: `Upload Video`, errorMessage: error._message });
  }
};
